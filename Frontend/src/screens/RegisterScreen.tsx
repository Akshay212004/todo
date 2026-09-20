import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorBanner from '../components/ErrorBanner';
import { validateConfirmPassword, validateEmail, validatePassword } from '../utils/validators';
import { getErrorMessage } from '../utils/errors';
import { colors } from '../utils/theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

interface FormErrors {
  email?: string;
  password?: string;
  confirm?: string;
}

const RegisterScreen = ({ navigation }: Props) => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleRegister = async () => {
    const nextErrors: FormErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
      confirm: validateConfirmPassword(password, confirm),
    };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password || nextErrors.confirm) return;

    setApiError(null);
    setSubmitting(true);
    try {
      // Registering also signs the user in (the API returns a token).
      await register(email.trim().toLowerCase(), password);
    } catch (error) {
      setApiError(getErrorMessage(error));
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Your tasks stay private and sync across sign-ins.">
      <ErrorBanner message={apiError} />

      <Input
        label="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          clearError('email');
        }}
        error={errors.email}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
      />

      <Input
        label="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          clearError('password');
        }}
        error={errors.password}
        placeholder="At least 6 characters"
        isPassword
        autoCapitalize="none"
        autoComplete="new-password"
      />

      <Input
        label="Confirm password"
        value={confirm}
        onChangeText={(text) => {
          setConfirm(text);
          clearError('confirm');
        }}
        error={errors.confirm}
        placeholder="Re-enter your password"
        isPassword
        autoCapitalize="none"
        onSubmitEditing={handleRegister}
      />

      <Button title="Create account" onPress={handleRegister} loading={submitting} style={styles.button} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Pressable onPress={() => navigation.navigate('Login')} hitSlop={10}>
          <Text style={styles.link}>Sign in</Text>
        </Pressable>
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  button: { marginTop: 8 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: colors.muted, fontSize: 15 },
  link: { color: colors.primary, fontSize: 15, fontWeight: '600' },
});

export default RegisterScreen;
