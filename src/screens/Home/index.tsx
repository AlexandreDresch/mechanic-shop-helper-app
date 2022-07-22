import { useState, useEffect } from "react";
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { HStack, IconButton, VStack, Text, Heading, FlatList, Center } from "native-base";
import { SignOut } from "phosphor-react-native";
import { ChatTeardropText } from 'phosphor-react-native';
import { useNavigation } from "@react-navigation/native";

import { dateFormat } from "../../utils/firestoreDateFormat";

import Logo from '../../assets/logo_secondary.svg';

import { Filter } from "../../components/Filter";
import { Button } from "../../components/Button";
import { Order, OrderProps } from "../../components/Order";
import { Loading } from "../../components/Loading";

export function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open');
    const [orders, setOrders] = useState<OrderProps[]>([]);

    const navigation = useNavigation();

    function handleNewOrder() {
        navigation.navigate('New');
    }

    function handleOpenDetails(orderId: string) {
        navigation.navigate('Details', { orderId });
    }

    function handleLogout() {
        auth()
            .signOut()
            .catch(error => {
                console.log(error);
                return Alert.alert('Logout', 'Failed to log out')
            });
    }

    useEffect(() => {
        setIsLoading(true);

        const subscriber = firestore()
            .collection('orders')
            .where('status', '==', statusSelected)
            .onSnapshot(snapshot => {
                const data = snapshot.docs.map(doc => {
                    const { plate, description, status, createdAt } = doc.data();

                    return {
                        id: doc.id,
                        plate,
                        description,
                        status,
                        when: dateFormat(createdAt),
                    }
                })

                setOrders(data);
                setIsLoading(false);
            });

        return subscriber;
    }, [statusSelected]);

    return (
        <VStack flex={1} pb={6} bg='trueGray.50'>
            <HStack
                w='full'
                justifyContent='space-between'
                alignItems='center'
                bg='trueGray.200'
                pt={12}
                pb={5}
                px={6}
            >
                <Logo />

                <IconButton
                    icon={<SignOut size={26} color='#ea580c' />}
                    onPress={handleLogout}
                />
            </HStack>

            <VStack flex={1} px={6}>
                <HStack w='full' mt={8} mb={4} justifyContent='space-between' alignItems='center'>
                    <Heading color='dark'>
                        My Orders
                    </Heading>
                    <Text color='gray.500'>
                        {orders.length}
                    </Text>
                </HStack>

                <HStack space={3} mb={8}>
                    <Filter
                        type="open"
                        title="In progress"
                        onPress={() => setStatusSelected('open')}
                        isActive={statusSelected === 'open'}
                    />

                    <Filter
                        type="closed"
                        title="Finished"
                        onPress={() => setStatusSelected('closed')}
                        isActive={statusSelected === 'closed'}
                    />
                </HStack>

                {
                    isLoading ? <Loading /> :
                    <FlatList
                        data={orders}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <Order data={item} onPress={() => handleOpenDetails(item.id)} />}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 50 }}
                        ListEmptyComponent={() => (
                            <Center>
                                <ChatTeardropText color="#d4d4d8" size={40} />
                                <Text color='gray.300' fontSize='xl' mt={6} textAlign='center'>
                                    You don't have{'\n'}
                                    requests {statusSelected === 'open' ? 'in progress.' : 'finished.'}
                                </Text>
                            </Center>
                        )}
                    />
                }

                <Button title="New order" onPress={handleNewOrder} />
            </VStack>
        </VStack>
    )
}