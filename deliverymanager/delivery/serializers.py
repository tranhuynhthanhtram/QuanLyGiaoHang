import cloudinary
from django.conf import settings
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.serializers import ModelSerializer
from . import cloud_path, facebook, google
from .models import User, Auction, Post, Order
from .register import register_social_user


class CustomerSerializer(ModelSerializer):
    image = serializers.SerializerMethodField(source='avatar')

    def get_image(self, obj):
        if obj.avatar:
            path = '{cloud_path}{image_name}'.format(cloud_path=cloud_path, image_name=obj.avatar)
            return path
        return None

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'image']
        extra_kwargs = {
            'get_image': {
                'read_only': True
            },
        }


class AuctionSerializer(serializers.ModelSerializer):
    shippers = CustomerSerializer()

    class Meta:
        model = Auction
        fields = ['id', 'price', 'created_date', 'shippers']


class PostSerializer(serializers.ModelSerializer):
    customers = CustomerSerializer(many=False)
    auctions = AuctionSerializer(many=True, read_only=True, source='posts')

    class Meta:
        model = Post
        fields = ['id', 'title', 'description', 'active', 'created_date', 'auctions', 'customers','shippers']


# class CommentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Comment
#         fields = ['id', 'content', 'created_date', 'reviewer']
#
class UserSerializer(serializers.ModelSerializer):
    # comments = CommentSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField(source='avatar')
    image_after = serializers.SerializerMethodField(source='after_identificationcard')
    image_before = serializers.SerializerMethodField(source='before_identificationcard')

    def get_image(self, obj):
        if obj.avatar:
            path = '{cloud_path}{image_name}'.format(cloud_path=cloud_path, image_name=obj.avatar)
            return path
        return None

    def get_image_after(self, obj):
        if obj.avatar:
            path = '{cloud_path}{image_name}'.format(cloud_path=cloud_path, image_name=obj.after_identificationcard)
            return path
        return None

    def get_image_before(self, obj):
        if obj.avatar:
            path = '{cloud_path}{image_name}'.format(cloud_path=cloud_path, image_name=obj.before_identificationcard)
            return path
        return None

    def create(self, validated_data):
        data = validated_data.copy()
        u = User(**data)

        if u.user_type == 'shipper':
            u.is_active = False
        else:
            u.is_active = True

        u.set_password(u.password)
        u.save()
        return u

    class Meta:
        model = User
        exclude = ['user_permissions', 'groups']
        extra_kwargs = {
            'avatar': {'write_only': 'True'},
            'after_identificationcard': {'write_only': 'True'},
            'before_identificationcard': {'write_only': 'True'},
            'password': {'write_only': 'True'}
        }


class GoogleSocialAuthSerializer(serializers.Serializer):
    auth_token = serializers.CharField()

    def validate_auth_token(self, auth_token):
        user_data = google.Google.validate(auth_token)
        try:
            user_data['sub']
        except:
            raise serializers.ValidationError(
                'The token is invalid or expired. Please login again.'
            )

        if user_data['aud'] != settings.GOOGLE_CLIENT_ID:
            raise AuthenticationFailed('we cannot authenticate for you!!!')
        email = user_data['email']
        name = user_data['email']
        provider = 'google'

        return register_social_user(
            provider=provider, email=email, name=name)


class FacebookSocialAuthSerializer(serializers.Serializer):
    auth_token = serializers.CharField()

    def validate_auth_token(self, auth_token):
        user_data = facebook.Facebook.validate(auth_token)

        try:
        # user_id = user_data['id']
            email = user_data['email']
            name = user_data['name']
            provider = 'facebook'
            return register_social_user(
                provider=provider,
                # user_id=user_id,
                email=email,
                name=name
            )
        except Exception:

            raise serializers.ValidationError(
                'The token  is invalid or expired. Please login again.'
            )


class OrderSerializer(serializers.ModelSerializer):
    customers = CustomerSerializer()
    shippers = CustomerSerializer()

    class Meta:
        model = Order
        fields = ['posts', 'active', 'created_at', 'customers', 'shippers']


