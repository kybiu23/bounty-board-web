from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0003_changes'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='subreddit',
        ),
    ]
