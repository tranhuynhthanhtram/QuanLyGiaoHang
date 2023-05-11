from rest_framework import pagination


class PostsPaginator(pagination.PageNumberPagination):
    page_size = 10