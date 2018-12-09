# Generated by Django 2.1.4 on 2018-12-09 22:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_remove_profile_contacts'),
    ]

    operations = [
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('profile_1', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='contact1', to='users.Profile')),
                ('profile_2', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='contact2', to='users.Profile')),
            ],
        ),
    ]
