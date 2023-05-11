import hashlib

from cloudinary import uploader
from django.conf import settings
from django.contrib.auth import logout, authenticate, login
from django.http import JsonResponse
from django.utils.html import format_html
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
# from .perms import *
from django.core.mail import send_mail, EmailMessage
from rest_framework.views import Response, APIView
from rest_framework import viewsets, permissions, generics, parsers, status, mixins
from rest_framework.decorators import action, api_view, permission_classes, parser_classes
from .models import User, AUTH_PROVIDERS, CodeConfirm, Auction, Post, Order
from .paginators import PostsPaginator
from .serializers import \
    UserSerializer, GoogleSocialAuthSerializer, FacebookSocialAuthSerializer, AuctionSerializer, PostSerializer, \
    OrderSerializer
from .utils import random_for_confirm_code


class UserViewSet(viewsets.ViewSet, generics.RetrieveAPIView, generics.CreateAPIView, generics.UpdateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [parsers.MultiPartParser, ]

    def get_permissions(self):
        if self.action in ['partial_update', 'update', 'retrieve', 'current_user']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @action(methods=['get'], url_path='current_user', detail=False)
    def current_user(self, request):
        return Response(data=UserSerializer(request.user).data, status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='change_password', detail=True)
    def change_password(self, request, pk):
        user = request.user
        password = request.data.get('password')
        if password:
            user.set_password(password)
            user.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['post'], url_path='reset_password', detail=False)
    def reset_password(self, request):
        email = request.data.get('email')
        if email:
            user = User.objects.filter(email=email).first()
            if user and user.auth_provider == AUTH_PROVIDERS['default']:
                code = random_for_confirm_code()
                CodeConfirm.objects.update_or_create(user=user, defaults={
                    'code': str(hashlib.sha256(str(code).encode("utf-8")).hexdigest())
                })
                subject = "Xác nhận reset mật khẩu trên hệ thống"
                content = """
                               Chào {0}
                               Chúng tôi đã nhận yêu cầu reset mật khẩu cho tài khoản của bạn.
                               Mã xác nhận cho tài khoản của bạn là: {1}
                               Nếu xác nhận thì đây cũng chính là mật khẩu mới của bạn.
                               Mọi thắc mắc và yêu cầu hỗ trợ xin gửi về địa chỉ 1951052209@ou.edu.vn.
                                                       """.format(user.username, code)
                send_email = EmailMessage(subject, content, to=[email])
                send_email.send()
                return Response(data={"message": "Send email confirm successfully"}, status=status.HTTP_200_OK)
            else:
                return Response(data={"error_message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['post'], url_path='reset_password/confirm', detail=False)
    def confirm(self, request):
        confirm_code = request.data.get('confirm_code')
        email = request.data.get('email')
        if email and confirm_code:
            user = User.objects.filter(email=email).first()
            if user:
                code_obj = CodeConfirm.objects.filter(user=user).first()
                if code_obj:
                    if str(code_obj.code).__eq__(
                            str(hashlib.sha256(str(confirm_code).encode("utf-8")).hexdigest())):
                        user.set_password(str(confirm_code))
                        user.save()
                        code_obj.delete()
                        return Response(data={"message": "Confirm successfully"}, status=status.HTTP_200_OK)
                    else:
                        return Response(data={"error_message": "Wrong code"}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response(data={"error_message": "Confirm code error"},
                                    status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(data={"error_message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class SendMailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        email = request.data.get('email')
        subject = request.data.get('subject')
        content = request.data.get('content')
        error_msg = None
        if email and subject and content:
            send_email = EmailMessage(subject, content, to=[email])
            send_email.send()
        else:
            error_msg = "Send mail failed !!!"
        if not error_msg:
            return Response(data={
                'status': 'Send mail successfully',
                'to': email,
                'subject': subject,
                'content': content
            }, status=status.HTTP_200_OK)
        return Response(data={'error_msg': error_msg}, status=status.HTTP_400_BAD_REQUEST)


class AuthInfo(APIView):
    def get(self, request):
        return Response(data=settings.OAUTH2_INFO, status=status.HTTP_200_OK)


class GoogleSocialAuthView(GenericAPIView):
    serializer_class = GoogleSocialAuthSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = ((serializer.validated_data)['auth_token'])
        return Response(data, status=status.HTTP_200_OK)


class FacebookSocialAuthView(GenericAPIView):

    serializer_class = FacebookSocialAuthSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = ((serializer.validated_data)['auth_token'])
        return Response(data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response(data={'message': "Login successfully"}, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(data={'error_msg': "Invalid user"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def logout_view(request):
    logout(request)
    return Response(status=status.HTTP_200_OK)


@api_view(['POST'])
@parser_classes([parsers.MultiPartParser])
@permission_classes([AllowAny])
def upload_image(request):
    if request.method == 'POST':
        image_file = request.FILES['upload']
        response = uploader.upload(image_file)
        return JsonResponse({'url': response['secure_url']})
        # return JsonResponse({'url': format_html('<img src="{}">', response['secure_url'])})

    return JsonResponse({'error': 'Invalid request method'})


class PostViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveUpdateDestroyAPIView):
    # queryset = Post.objects.filter(active=True).order_by('-created_date')
    queryset = Post.objects.all().order_by('-created_date')
    serializer_class = PostSerializer
    pagination_class = PostsPaginator

    def get_permissions(self):
        if self.action in ['create', 'destroy', 'update', 'retrieve', 'auction', 'list']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def filter_queryset(self, queryset):

        active = self.request.query_params.get('active')
        if active:
            if active == 'true':
                queryset = queryset.filter(active=True)
            elif active == 'false':
                queryset = queryset.filter(active=False)

        user = self.request.query_params.get('user')
        if user:
            if user == str(self.request.user.id):
                queryset = queryset.filter(customers_id=self.request.user.id)

        return queryset

    @parser_classes([parsers.MultiPartParser])
    def create(self, request):
        p = Post(title=request.data['title'], description=request.data['description'], customers=request.user)
        p.save()
        return Response(PostSerializer(p, context={'request': request}).data, status=status.HTTP_201_CREATED)

    # def update(self, request, pk):
    #     p = self.get_object()
    #     for key, value in request.data.items():
    #         setattr(p, key, value)
    #     p.save()
    #     return Response(PostSerializer(p, context={'request': request}).data, status=status.HTTP_200_OK)

    @parser_classes([parsers.MultiPartParser])
    @action(methods=['post'], detail=True, url_path='auction')
    def auction(self, request, pk):
        shipper = request.user.id  # user_id
        price = request.data.get('price')

        try:
            user = User.objects.get(id=shipper)

            if user.user_type == 'shipper':
                if Auction.objects.filter(posts=self.get_object(), shippers=user).exists():
                    return Response({"detail": "Bạn đã đấu giá cho bài viết này rồi."},
                                    status=status.HTTP_400_BAD_REQUEST)

                auction = Auction(price=price, posts=self.get_object(), shippers=user)
                auction.save()

                serializer = AuctionSerializer(auction)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response({"detail": "Chỉ người gửi hàng mới có thể đấu giá bài viết."},
                                status=status.HTTP_400_BAD_REQUEST)

        except Post.DoesNotExist:
            return Response({"detail": "Bài viết không tồn tại."}, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response({"detail": "Người dùng không tồn tại."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": f"Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(methods=['post'], detail=True, url_path='shipper')
    def shipper(self, request, pk):
        # # post_id = self.get_object()
        # shipper_id = request.data['shipper_id']
        #
        # # post = Post.objects.get(id=post_id)
        # shipper = User.objects.get(id=shipper_id)

        try:
            shipper_id = request.data['shipper_id']
            # print(f"shipper_id: {shipper_id}")
            # shipper = Auction.objects.filter(shippers_id=shipper_id).last()
            auction = Auction.objects.filter(shippers_id=shipper_id).last()
            shipper = auction.shippers
            # shipper = User.objects.get(id=shipper_id)
        except (KeyError, User.DoesNotExist) as e:
            # print(f"Error: {e}")
            return Response({"detail": "Invalid shipper ID"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Order.objects.create(shippers=shipper, posts=self.get_object(), active=False, customers=request.user)
            order.save()
        except Exception as e:
            print(f"Error: {e}")

            return Response({"detail": "Error creating order"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # # Tạo đơn hàng với shipper đã chọn
        # order = Order.objects.create(shippers=shipper, posts=self.get_object(), active=False)
        # order.save()

        # Cập nhật trường 'active' của bài viết thành False
        post = self.get_object()
        post.active = False
        post.save()

        send_mail(
            'Thông báo đơn hàng',
            f'Bạn đã được chọn để vận chuyển đơn hàng {post.title}',
            '1951052209@ou.edu.vn',
            [shipper.email],
            fail_silently=False,
        )

        # Gửi email từ chối cho các shipper khác
        other_shippers = post.shippers.exclude(id=shipper_id)
        for shipper in other_shippers:
            send_mail(
                'Thông báo đơn hàng',
                f'Xin lỗi, bạn không được chọn để vận chuyển đơn hàng {post.title}',
                '1951052209@ou.edu.vn',
                [shipper.email],
                fail_silently=False,
            )

        return Response({"detail": "Shipper đã được chọn thành công và trạng thái bài viết đã được cập nhật"})
#
#     @action(methods=['post'], detail=True, url_path='comments')
#     def comments(self, request, pk):
#         shipper_id = request.data['shipper_id']
#         shipper_order = Order.object.get(shipper_id=shipper_id)
#         if shipper_order & shipper_order.active==True:
#             c = Comment(content=request.data['content'], lesson=self.get_object(), user=request.user)
#             c.save()
#         return Response(CommentSerializer(c, context={'request': request}).data, status=status.HTTP_201_CREATED)
#


class OrderViewSet(viewsets.ViewSet, generics.ListAPIView, generics.UpdateAPIView, generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_permissions(self):
        if self.action in ['list', 'update']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def filter_queryset(self, queryset):

        shipped = self.request.query_params.get('ship')
        if shipped:
            if shipped == 'shipped':
                queryset = queryset.filter(active=True)
            elif shipped == 'unshipped':
                queryset = queryset.filter(active=False)

        if self.request.user.user_type == 'shipper':
            queryset = queryset.filter(shippers_id=self.request.user.id)
        elif self.request.user.user_type == 'customer':
            queryset = queryset.filter(customers_id=self.request.user.id)

        # queryset = queryset.filter(shippers_id=self.request.user.id)

        return queryset

    def update(self, request, *args, **kwargs):
        o = self.get_object()
        for key, value in request.data.items():
            setattr(o, key, value)
        o.save()

        send_mail(
            'Thông báo đơn hàng',
            f'Đơn hàng {o.posts_id} của bạn đã được vận chuyển thành công',
            '1951052209@ou.edu.vn',
            [o.customers.email],
            fail_silently=False,
        )

        return Response(OrderSerializer(o, context={'request': request}).data, status=status.HTTP_200_OK)


    # def list(self, request):
    #     queryset = self.filter_queryset(self.get_queryset())
    #
    #     shipped = self.request.query_params.get('shipped')
    #     if shipped:
    #         if shipped == 'shipped':
    #             queryset = queryset.filter(active=True)
    #         elif shipped == 'unshipped':
    #             queryset = queryset.filter(active=False)
    #
    #     serializer = OrderSerializer(queryset, many=True)
    #     return Response(serializer.data, status=status.HTTP_200_OK)



    # def list(self, request):
    #     unshipped_orders = Order.objects.filter(active=False)
    #     unshipped_serializer = OrderSerializer(unshipped_orders, many=True)
    #
    #     shipped_orders = Order.objects.filter(active=True)
    #     shipped_serializer = OrderSerializer(shipped_orders, many=True)
    #
    #     return Response({'unshipped_orders': unshipped_serializer.data, 'shipped_orders': shipped_serializer.data},
    #                     status=status.HTTP_200_OK)


# class AuctionViewSet(viewsets.ModelViewSet):
#     serializer_class = AuctionSerializer
#
#     def get_queryset(self):
#         # Lấy chi tiết bài đấu giá có id là 1 và id người shipper là 2
#         auction_post = Auction.objects.filter(id=self.kwargs['pk']).first()
#         shipper = Shipper.objects.filter(id=self.kwargs['shipper_id']).first()
#         if auction_post and shipper:
#             # Kiểm tra xem người shipper có tham gia vào bài đấu giá không
#             if auction_post.shipper == shipper:
#                 return AuctionPost.objects.filter(id=self.kwargs['pk'], shipper=shipper)
#         return AuctionPost.objects.none()


