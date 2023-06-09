# Generated by Django 4.1.7 on 2023-04-27 06:41

import ckeditor.fields
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('delivery', '0002_remove_comment_reviewer_remove_comment_shipper_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Auction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('price', models.FloatField()),
                ('created_date', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('updated_date', models.DateTimeField(auto_now=True)),
                ('title', models.CharField(max_length=100)),
                ('description', ckeditor.fields.RichTextField()),
                ('active', models.BooleanField(default=True)),
                ('customers', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='customers', to=settings.AUTH_USER_MODEL)),
                ('shippers', models.ManyToManyField(related_name='posts_shippers', through='delivery.Auction', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='auction',
            name='posts',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='posts', to='delivery.post'),
        ),
        migrations.AddField(
            model_name='auction',
            name='shippers',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='shippers_auctions', to=settings.AUTH_USER_MODEL),
        ),
    ]
