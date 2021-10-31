import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  // TODO MODAL WITH IMAGE AND EXTERNAL LINK
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent maxW="900px" minW="unset" w="auto" maxH="600px" h="auto">
          <ModalBody p="0" w="auto" maxH="600px">
            <Image
              src={imgUrl}
              alt="Image visualization"
              objectFit="scale-down"
              maxH="600"
            />
          </ModalBody>

          <ModalFooter
            justifyContent="flex-start"
            bgColor="pGray.800"
            borderBottomRadius="md"
          >
            <Link href={imgUrl} target="_blank">
              Abrir original
            </Link>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
