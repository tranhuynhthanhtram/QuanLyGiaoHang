from django.contrib.auth import authenticate
from .models import User
import random
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed
from .models import AUTH_PROVIDERS


def generate_username(name):
    username = "".join(name.split(' ')).lower()
    if not User.objects.filter(username=username).exists():
        return username
    else:
        random_username = username + str(random.randint(0, 1000))
        return generate_username(random_username)


def register_social_user(provider, email, name):
    filtered_user_by_email = User.objects.filter(email=email)

    if filtered_user_by_email.exists():

        if provider == filtered_user_by_email[0].auth_provider:
            registered_user = authenticate(
                username=filtered_user_by_email[0].username, password=settings.SOCIAL_SECRET)
            if registered_user:
                return {
                    'username': registered_user.username,
                    'email': registered_user.email,
                    'tokens': registered_user.tokens()}
            else:
                raise AuthenticationFailed(
                    detail='Invalid user')

        else:
            raise AuthenticationFailed(
                detail='Please continue your login using ' + filtered_user_by_email[0].auth_provider)

    else:
        user = {
            'username': generate_username(name), 'email': email,
            'password': settings.SOCIAL_SECRET}
        user = User.objects.create_user(**user)
        user.auth_provider = provider
        user.user_type = 'customer'
        if user.auth_provider == AUTH_PROVIDERS['facebook']:
            user.avatar = "image/upload/v1682350487/Facebook-logo-blue-circle-large-transparent-png_bjpu4m.png"
            user.after_identificationcard = "image/upload/v1682350487/Facebook-logo-blue-circle-large-transparent-png_bjpu4m.png"
            user.before_identificationcard = "image/upload/v1682350487/Facebook-logo-blue-circle-large-transparent-png_bjpu4m.png"
        elif user.auth_provider == AUTH_PROVIDERS['google']:
            user.avatar = "image/upload/v1682350678/Google__G__Logo_zsxbfw.png"
            user.after_identificationcard = "image/upload/v1682350678/Google__G__Logo_zsxbfw.png"
            user.before_identificationcard = "image/upload/v1682350678/Google__G__Logo_zsxbfw.png"
        user.save()
        new_user = authenticate(
            username=user.username, password=settings.SOCIAL_SECRET)
        return {
            'email': new_user.email,
            'username': new_user.username,
            'tokens': new_user.tokens()
        }


