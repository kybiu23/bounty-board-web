from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0002_alter_crawlhistory_options_alter_user_managers_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='title',
            field=models.CharField(max_length=1024),
        ),
        migrations.AlterField(
            model_name='post',
            name='post_url',
            field=models.CharField(max_length=1024, blank=True, null=True),
        ),
        migrations.RemoveField(
            model_name='comment',
            name='post',
        ),
        migrations.AddField(
            model_name='comment',
            name='url',
            field=models.CharField(max_length=1024, blank=True, null=True),
        ),
    ]
