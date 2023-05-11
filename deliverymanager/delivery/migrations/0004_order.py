# Generated by Django 4.1.7 on 2023-04-27 06:47

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('delivery', '0003_auction_post_auction_posts_auction_shippers'),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('posts', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='delivery.post')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('active', models.BooleanField(default=0)),
                ('customers', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='customers_orders', to=settings.AUTH_USER_MODEL)),
                ('shippers', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='shippers_orders', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
