import FormContainer from '@/components/form/FormContainer';
import { updataProfileAction, fetchProfile, updateProfileImageAction } from '@/utils/actions';
import FormInput from '@/components/form/FormInput';
import { SubmitButton } from '@/components/form/Buttons'
import ImageInput from '@/components/form/ImageInput';
import ImageInputContainer from '@/components/form/ImageInputContainer';

const ProfilePage = async () => {
  const profile = await fetchProfile();
  return (
    <section>
    <h1 className="text-2xl font-semibold mb-8 capitalize">User profile</h1>
    <div className="border p-8 rounded-md">
      {/* image input container */ }
      <ImageInputContainer image={profile.profileImage} name={profile.username} action={updateProfileImageAction} text='Update profile image'/>
        <FormContainer action={updataProfileAction}>
            <div className="grid md:grid-cols-2 gap-4 mt4">
                <FormInput 
                type='text' 
                name='firstName' 
                label='First Name' 
                defaultValue={profile.firstName} />
                <FormInput 
                type='text'
                 name='lastName' 
                 label='Last Name' 
                 defaultValue={profile.lastName} />
                <FormInput 
                type='text' 
                name='username' 
                label='UserName' 
                defaultValue={profile.username} />
            </div>  
            <SubmitButton text='Update profile' className="mt-8" size='sm'/>
        </FormContainer>
    </div>
   </section>
  )
}

export default ProfilePage;
