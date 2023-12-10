# Import django
from rest_framework.pagination import PageNumberPagination


class SmallPagination(PageNumberPagination):
    """
    Pagination class for small pages
    """
    page_size = 5


class MediumPagination(PageNumberPagination):
    """
    Pagination class for medium pages
    """
    page_size = 10