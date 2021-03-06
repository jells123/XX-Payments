# Generated by Django 2.1.4 on 2018-12-12 23:00

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('kitty', '0002_auto_20181212_2238'),
    ]

    operations = [
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.FloatField(validators=[django.core.validators.MinValueValidator(0.01)])),
                ('state', models.CharField(choices=[('OP', 'Open'), ('CL', 'Closed')], default='OP', max_length=2)),
            ],
        ),
        migrations.AlterField(
            model_name='kitty',
            name='amount',
            field=models.FloatField(validators=[django.core.validators.MinValueValidator(0.01)]),
        ),
        migrations.AddField(
            model_name='transaction',
            name='kitty',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transactions', to='kitty.Kitty'),
        ),
        migrations.AddField(
            model_name='transaction',
            name='participant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='transactions', to=settings.AUTH_USER_MODEL),
        ),
    ]
