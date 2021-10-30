import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { CardModel } from '../models/Card';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface CardsProps {
  cards: CardModel[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedImgUrl, setSelectedImgUrl] = useState<string>(null);

  const handleViewImage = (imgUrl: string): void => {
    setSelectedImgUrl(imgUrl);
    onOpen();
  };

  return (
    <>
      <SimpleGrid columns={3} spacing="40px">
        {cards.map(card => (
          <Card key={card.id} data={card} viewImage={handleViewImage} />
        ))}
      </SimpleGrid>

      <ModalViewImage
        isOpen={isOpen}
        onClose={onClose}
        imgUrl={selectedImgUrl}
      />
    </>
  );
}
