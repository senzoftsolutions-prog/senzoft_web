from django.urls import path

from .views import ConsentConfigView, ConsentCreateView, ConsentHistoryView

urlpatterns = [
    path("consent/config/", ConsentConfigView.as_view()),
    path("consent/", ConsentCreateView.as_view()),
    path("consent/history/", ConsentHistoryView.as_view()),
]

