import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Validacija tipa i veličine
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, profileImage: 'Morate izabrati sliku.' }));
        setProfileImageFile(null);
        setImagePreview(null);
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB limit primer
        setErrors(prev => ({ ...prev, profileImage: 'Slika mora biti manja od 2MB.' }));
        setProfileImageFile(null);
        setImagePreview(null);
        return;
      }
      setProfileImageFile(file);
      setErrors(prev => ({ ...prev, profileImage: '' }));
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setProfileImageFile(null);
      setImagePreview(null);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Korisničko ime je obavezno';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Korisničko ime mora imati najmanje 3 karaktera';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email je obavezan';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email nije valjan';
    }

    if (!formData.password) {
      newErrors.password = 'Lozinka je obavezna';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Lozinka mora imati najmanje 6 karaktera';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Lozinke se ne poklapaju';
    }

    if (!profileImageFile) {
      newErrors.profileImage = 'Slika profila je obavezna';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !profileImageFile) return;

    setIsLoading(true);
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        profileImageFile,
      });
      navigate('/dashboard');
    } catch (error) {
      // greška već može biti obrađena u context-u
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Registrujte se
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ili{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              prijavite se ako već imate nalog
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registracija</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Korisničko ime"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                required
              />
              <Input
                label="Email adresa"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
              <Input
                label="Lozinka"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
              />
              <Input
                label="Potvrdite lozinku"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
              />

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Slika profila</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm"
                />
                {errors.profileImage && (
                  <p className="text-sm text-red-600">{errors.profileImage}</p>
                )}
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-24 w-24 object-cover rounded-full border"
                    />
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Registrujte se
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};