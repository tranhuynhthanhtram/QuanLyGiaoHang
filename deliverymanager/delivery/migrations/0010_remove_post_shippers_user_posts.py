# Generated by Django 4.1.7 on 2023-05-08 16:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('delivery', '0009_rename_auctions_post_shippers'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='shippers',
        ),
        migrations.AddField(
            model_name='user',
            name='posts',
            field=models.ManyToManyField(related_name='shippers_posts', through='delivery.Auction', to='delivery.post'),
        ),
    ]
