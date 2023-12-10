from rest_framework.pagination import PageNumberPagination

class MediumPagination(PageNumberPagination):
    """
    Pagination class for medium pages
    """
    page_size = 15