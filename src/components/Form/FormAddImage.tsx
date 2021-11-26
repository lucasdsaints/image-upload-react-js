import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';
import { convertByteToMB } from '../../utils/valueConvertions';

interface ImageFormValues {
  image: FileList;
  title: string;
  description: string;
}

interface ImageData {
  url: string;
  title: string;
  description: string;
}

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: 'Arquivo obrigatório',
      validate: {
        lessThan10MB: (files: File[]) => {
          const file = files[0];
          const fileMBSize = file ? convertByteToMB(file.size) : 0;

          if (fileMBSize > 10) {
            return 'O arquivo deve ser menor que 10MB';
          }

          return true;
        },
        acceptedFormats: (files: File[]) => {
          const file = files[0];
          const acceptedFileRegex = /image\/(jpeg|png|gif)/;

          if (!acceptedFileRegex.test(file.type)) {
            return 'Somente são aceitos arquivos PNG, JPEG e GIF';
          }

          return true;
        },
      },
    },
    title: {
      required: 'Título obrigatório',
      minLength: { value: 2, message: 'Mínimo de 2 caracteres' },
      maxLength: { value: 20, message: 'Máximo de 20 caracteres' },
    },
    description: {
      required: 'Descrição obrigatória',
      maxLength: { value: 65, message: 'Máximo de 65 caracteres' },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (imageData: ImageData) => api.post('/api/images', imageData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: ImageFormValues): Promise<void> => {
    console.log('onSubmit', data, imageUrl);
    try {
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          status: 'error',
          isClosable: true,
        });
      }

      const imageData: ImageData = {
        url: imageUrl,
        title: data.title,
        description: data.description,
      };
      await mutation.mutateAsync(imageData);

      toast({
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso.',
        status: 'success',
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        status: 'error',
        isClosable: true,
      });
    } finally {
      reset();

      setImageUrl('');
      setLocalImageUrl('');

      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image}
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          error={errors.title}
          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error={errors.description}
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
