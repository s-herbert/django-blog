from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.utils import timezone
from .models import TethysServer,Container,Document

import json




# Create your views here.
def container_list(request):
	containers = Container.objects.all().order_by('name')
	content_dict = {
					'containers':containers,
					}
	return render(request, 'tethys/container_list.html', content_dict)
	
def container_detail(request,name):
	container = get_object_or_404(Container,name=name)
	content_dict = {
					'container':container,
					}
	return render(request,'tethys/container_detail.html',content_dict)
	
def refresh_container(request):
	if request.method == 'GET':
		collection = request.GET.get('the_collection')
		response_data = {}

		
		container = Container.objects.get(name=collection)
		result = container.refresh()
		
		print result
		
		updated_time = timezone.localtime(container.last_updated).strftime('%B %#d, %Y, %H:%M')
		doc_names = container.document_set.values_list('name',flat=True).order_by('name')

		response_data['result'] = 'refresh successful!'
		response_data['count'] = container.count
		response_data['docs'] = ' '.join(doc_names)
		response_data['server_info'] = 'http://'+container.server.url + ':' + str(container.server.port)
		response_data['updated'] = updated_time
		
		return HttpResponse(
			json.dumps(response_data),
			content_type="application/json"
		)
	else:
		return HttpResponse(
			json.dumps({"nothing to see": "this isn't happening"}),
			content_type="application/json"
		)
		
		
def load_document(request,doc_name,collection):
	document = Document.objects.get(name=doc_name)
	content_dict = {
					'doc_name':document.name,
					'collection':collection,
					'server':document.container.server.url,
					'port':str(document.container.server.port),
					}
	return render(request,'tethys/load_document.html',content_dict)

	

	
