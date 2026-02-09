/**
 * ProfileForm component – allows the authenticated user to view and update their profile.
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Alert } from '@/components/ui';
import { useAccount } from '../hooks/useAccount';

/** Validation schema for profile edits */
const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { profile, isLoading, error, loadProfile, updateProfile } = useAccount();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitSuccessful },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
  });

  /* Load profile on mount */
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  /* Populate form when profile loads */
  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    await updateProfile(data);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-text">My Profile</h2>

      {error && <Alert variant="error">{error}</Alert>}
      {isSubmitSuccessful && !error && (
        <Alert variant="success">Profile updated successfully.</Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            autoComplete="given-name"
            error={errors.firstName?.message}
            required
            {...register('firstName')}
          />
          <Input
            label="Last Name"
            autoComplete="family-name"
            error={errors.lastName?.message}
            required
            {...register('lastName')}
          />
        </div>

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          required
          {...register('email')}
        />

        <Input
          label="Phone"
          type="tel"
          autoComplete="tel"
          error={errors.phone?.message}
          required
          {...register('phone')}
        />

        <Button type="submit" isLoading={isLoading} disabled={!isDirty}>
          Save Changes
        </Button>
      </form>
    </div>
  );
}
