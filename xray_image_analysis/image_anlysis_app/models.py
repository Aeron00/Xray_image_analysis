from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models

# Create your models here.
class CustomUserManager(UserManager):
	"""
	Method Name : CustomUserManager => create_user                                   Created By : Aeron
	Purpose : create's user in database                                              Created At : 10 Apr 24
	Arguments : email & password                                                     Updated By : 
	Return Type : created user								                         Update At  : 
 	"""
	def create_user(self, email, password=None):
		if not email:
			raise ValueError('An email is required.')
		if not password:
			raise ValueError('A password is required.')
		
		email = self.normalize_email(email)
		user = self.model(email=email)
		user.set_password(password)
		user.save()
		return user
	
	"""
	Method Name : CustomUserManager => create_superuser                              Created By : Aeron
	Purpose : create's superuser in database                                         Created At : 10 Apr 24
	Arguments : email & password                                                     Updated By : 
	Return Type : created user									                     Update At  : 
 	"""
	def create_superuser(self, email, password=None):
		if not email:
			raise ValueError('An email is required.')
		if not password:
			raise ValueError('A password is required.')
		user = self.create_user(email, password)
		user.is_staff = True
		user.is_superuser = True
		user.save()
		return user
	

"""
Method Name : user_directory_path					                             Created By : Aeron
Purpose : create's custom file path to store profile image                       Created At : 10 Apr 24
Arguments : instance & filename                                                  Updated By : 
Return Type : path => string								                     Update At  : 
"""
def user_directory_path(instance, filename): 
	return f'user_{instance.id}/{filename}' #'profile.'+filename.split('.')[1]


"""
Method Name : CustomUser							                             Created By : Aeron
Purpose : decides table fields to store user information		                 Created At : 10 Apr 24
Arguments : any model fields													 Updated By : 
Return Type : created user									                     Update At  : 
"""
class CustomUser(AbstractUser):
	email = models.EmailField(unique=True)
	profile_img = models.ImageField(upload_to=user_directory_path)
	date_of_birth = models.DateField(max_length=8, blank=True, null=True)
	GENDER_CHOICES = (
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other')
    )
	gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, null=True)

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = []
	
	objects = CustomUserManager()
	
	def __str__(self) -> str:
		return self.email
	
