# Generated by Django 4.1.7 on 2023-05-08 17:11

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('delivery', '0010_remove_post_shippers_user_posts'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='posts',
        ),
        migrations.AddField(
            model_name='post',
            name='shippers',
            field=models.ManyToManyField(related_name='posts_shippers', through='delivery.Auction', to=settings.AUTH_USER_MODEL),
        ),
    ]
