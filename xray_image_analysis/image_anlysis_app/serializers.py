from rest_framework import serializers
from .models import CustomUser

"""
Method Name : UserSerializer						                             Created By : Aeron
Purpose : to serialize data while signup                		                 Created At : 10 Apr 24
Arguments : ['username', 'email', 'password'] in key_value  					 Updated By : 
Return Type : returns serialized data object    			                     Update At  : 
"""
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'profile_img', 'date_of_birth', 'gender']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser(
            username=validated_data['username'],
            email=validated_data['email'],
            profile_img=validated_data['profile_img'],
            date_of_birth=validated_data['date_of_birth'],
            gender=validated_data['gender'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

