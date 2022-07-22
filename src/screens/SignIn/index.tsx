import { useState } from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { VStack, Heading, Icon } from 'native-base';
import { Envelope, Key} from 'phosphor-react-native';

import Logo from '../../assets/logo.svg';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export function SignIn() {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    function handleSignIn() {
        if(!email || !password) {
            return Alert.alert('Warning', 'Enter email and password');
        }
        setIsLoading(true);

        auth().signInWithEmailAndPassword(email, password)
        .catch((error) => {
            console.log(error);
            setIsLoading(false);

            if(error.code === 'auth/invalid-email') {
                return Alert.alert('Warning', 'Invalid email.');
            } 

            if(error.code === 'auth/wrong-password') {
                return Alert.alert('Warning', 'Invalid email or password.');
            } 

            if(error.code === 'auth/user-not-found') {
                return Alert.alert('Warning', 'Unregistered user.');
            }

            return Alert.alert('Warning', 'Could not access the application.');

            

        });
    }

    return (
        <VStack flex={1} alignItems='center' bg='trueGray.50' px={8} pt={24}>
            <Logo style={{ width: 10, height: 10}}/>

            <Heading color='trueGray.900' fontSize='xl' mt={20} mb={6}>
                Access your account
            </Heading>

            <Input 
                placeholder='E-mail'                
                InputLeftElement={<Icon as={<Envelope color='#a1a1aa'/>} ml={4}/>}
                onChangeText={setEmail}
                mb={5}
            />

            <Input 
                placeholder='Password'
                InputLeftElement={<Icon as={<Key color='#a1a1aa'/>} ml={4}/>}
                secureTextEntry={true}
                onChangeText={setPassword}
                mb={8}
            />

            <Button 
                title='Log in' 
                w='full'
                onPress={handleSignIn}
                isLoading={isLoading}
            />
        </VStack>
    );
}