from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.container_list, name='container_list'),
	url(r'^collection/(?P<name>\w+)/$', views.container_detail, name='container_detail'),
	url(r'^refresh_container/$',views.refresh_container, name='refresh_container')
]