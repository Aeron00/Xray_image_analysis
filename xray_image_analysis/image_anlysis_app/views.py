from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
from .models import CustomUser
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.utils import timezone
from .image_analyzer_module import analyse_image

# Create your views here.
"""
Method Name : RegisterUser => post                                              Created By : Aeron
Purpose : api for user signup                                                   Created At : 10 Apr 24
Arguments : key-value pair of ['username', 'email', 'password']                 Updated By : 
Return Type : key-value pair of ['username', 'email', 'password']               Update At : 
              on success or bad request on error
"""
class RegisterUser(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        print(serializer)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

"""
Method Name : LoginUser => post                                                 Created By : Aeron
Purpose : api for user login                                                    Created At : 10 Apr 24
Arguments : key-value pair of ['email', 'password']                             Updated By : 
Return Type : token on success or unauthorized on error                         Update At  : 
"""
class LoginUser(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        user = None
        if '@' in email:
            try:
                user = CustomUser.objects.get(email=email)
            except ObjectDoesNotExist:
                return Response({'error': 'Invalid email'}, status=status.HTTP_401_UNAUTHORIZED)
            
        if user:
            user = authenticate(email=email, password=password)
            
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            user.last_login = timezone.now()
            user.save()
            return Response({'token': token.key}, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
    
"""
Method Name : LogoutUser => post                                                 Created By : Aeron
Purpose : api for user logout                                                    Created At : 10 Apr 24
Arguments : token in header                                                      Updated By : 
Return Type : Successfully logged out message on success or error on error       Update At  : 
"""
class LogoutUser(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


"""
Method Name : UserProfile => get                                                 Created By : Aeron
Purpose : api to get user information                                            Created At : 10 Apr 24
Arguments : token in header                                                      Updated By : 
Return Type : success message on success or error on error                       Update At  : 
"""
class UserProfile(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            user = CustomUser.objects.get(email=request.user)
            serializer = UserSerializer(user)
            userData = serializer.data
            userData['id'] = user.id
            return Response(userData)
        except CustomUser.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    

"""
Method Name : ImageAnalysis => post                                              Created By : Aeron
Purpose : api for image analysis                                                 Created At : 10 Apr 24 
Arguments : token in header                                                      Updated By : 
Return Type : key-value response                                                 Update At  : 
"""
class ImageAnalysis(APIView):
    def post(self, request):
        uploaded_file = request.data.get('image')
    
        if not uploaded_file:
            return Response({'error': 'No image file provided'}, status=400)
        image_bytes = uploaded_file.read()
        output = analyse_image(image_bytes)

        return Response({'output': output})
