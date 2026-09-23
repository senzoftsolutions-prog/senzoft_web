from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("careers", "0004_job_about_company_job_additional_locations_and_more")]

    operations = [
        migrations.AddField(model_name="candidateprofile", name="address_line1", field=models.CharField(blank=True, max_length=255)),
        migrations.AddField(model_name="candidateprofile", name="address_line2", field=models.CharField(blank=True, max_length=255)),
        migrations.AddField(model_name="candidateprofile", name="city", field=models.CharField(blank=True, max_length=120)),
        migrations.AddField(model_name="candidateprofile", name="state", field=models.CharField(blank=True, max_length=120)),
        migrations.AddField(model_name="candidateprofile", name="postal_code", field=models.CharField(blank=True, max_length=24)),
        migrations.AddField(model_name="candidateprofile", name="country", field=models.CharField(blank=True, max_length=120)),
    ]
