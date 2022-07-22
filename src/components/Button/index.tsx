import { Button as NBButton, IButtonProps, Heading } from "native-base";

type Props = IButtonProps & {
    title: string;
}

export function Button({title, ...rest}: Props) {
    return (
        <NBButton 
            bg='orange.600'
            h={14}
            fontSize='sm'
            rounded='sm'
            _pressed={{ bg: 'orange.500'}}
            {...rest}
        >
            <Heading color='white' fontSize='md'>
                {title}
            </Heading>

        </NBButton>
    )
}