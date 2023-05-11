from ckeditor_uploader.fields import RichTextUploadingField
from cloudinary.models import CloudinaryField
from django.db import models
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField
from rest_framework_simplejwt.tokens import RefreshToken

# Create your models here.


AUTH_PROVIDERS = {'facebook': 'facebook',
                  'google': 'google',
                  'default': 'default'}


class User(AbstractUser):
    USER_TYPE_CHOICES = (
            ('shipper', 'Shipper'),
            ('customer', 'Customer'),
    )
    user_type = models.CharField(choices=USER_TYPE_CHOICES, max_length=10, null=True)
    avatar = CloudinaryField('avatar', default='', null=True)
    after_identificationcard = CloudinaryField('after_identificationcard', default='', null=True)
    before_identificationcard = CloudinaryField('before_identificationcard', default='', null=True)
    email = models.EmailField(unique=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    updated_date = models.DateTimeField(auto_now=True)
    auth_provider = models.CharField(
        max_length=255, blank=False,
        null=False, default=AUTH_PROVIDERS.get('default'))

    def __str__(self):
        return self.username

    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }


class CodeConfirm(models.Model):
    user = models.OneToOneField('User', on_delete=models.CASCADE, primary_key=True)
    code = models.CharField(max_length=100)


class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class Post(models.Model):
    customers = models.ForeignKey(User, on_delete=models.CASCADE, related_name='customers')
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    title = models.CharField(max_length=100)
    description = RichTextField()
    active = models.BooleanField(default=True)  # dang dau gia
    shippers = models.ManyToManyField('User', related_name='posts_shippers', through='Auction')


class Auction(models.Model):#đấu giá
    price = models.FloatField()
    created_date = models.DateTimeField(auto_now_add=True)
    posts = models.ForeignKey(Post, related_name='posts', on_delete=models.CASCADE)
    shippers = models.ForeignKey(User, related_name='shippers_auctions', on_delete=models.CASCADE)


class Order(models.Model):
    shippers = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shippers_orders')
    customers = models.ForeignKey(User, on_delete=models.CASCADE, related_name='customers_orders', null=True)
    posts = models.OneToOneField(Post, on_delete=models.CASCADE, primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=0)#chưa


# class Comment(BaseModel):
#     content = models.CharField(max_length=255)
#     reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews_given',
#                                  null=True)  # Người đánh giá
#     shipper = models.ForeignKey(User, on_delete=models.CASCADE,
#                                 related_name='reviews_received', null=True)  # Shipper được đánh giá
#     created_date = models.DateTimeField(auto_now_add=True, null=True)
#
#     def __str__(self):
#         return self.content
#
#
# class ActionBase(BaseModel):
#     users = models.ForeignKey(User, on_delete=models.CASCADE)
#     # shippers = models.ForeignKey(Shipper, on_delete=models.CASCADE)
#
#     class Meta:
#         # unique_together = ('customers', 'shippers')
#         abstract = True
#
#
# class Like(ActionBase):
#     liked = models.BooleanField(default=True)
#
#
# class Rating(ActionBase):
#     rate = models.SmallIntegerField(default=0)


# class ThanhToan(models.Model):
#     donhang = models.OneToOneField(DonHang, related_name='thanhtoan_donhang', on_delete=models.CASCADE)
#     user = models.ForeignKey(User, related_name='thanhtoan_user', on_delete=models.CASCADE)
#     amount = models.FloatField()
#     transaction_id = models.CharField(max_length=100)
#     created_at = models.DateTimeField(auto_now_add=True)