import React, {useEffect, useState} from 'react';
import {Card, Collection, Divider, Flex, Heading, Image} from '@aws-amplify/ui-react';
import {Storage} from 'aws-amplify';
import './App.css';

interface IImageCard {
  key: string,
  imageUrl: string
}

function App() {

  const [images, setImages] = useState<IImageCard[]>([]);

  const fetchImages = async () => {
    try {
      const imageListResponse = await Storage.list('', {level: 'public'});
      const mappedImages = await mapResponseToImages(imageListResponse);
      setImages(mappedImages);
    } catch (err) {
      console.error(err);
    }
  }

  const mapResponseToImages = async (imageResponse: any[]): Promise<IImageCard[]> => {
    const imageList: IImageCard[] = [];
    await (async () => {
      for (const image of imageResponse) {
        if (image.key !== null && image.key !== '') {
          const imageUrl = await Storage.get(image.key, {level: 'public'});
          imageList.push({key: image.key, imageUrl: imageUrl});
        }
      }
    })();
    return imageList;
  }

  useEffect(() => {
    fetchImages();
  }, []);


  return (
      <div className="App">
        <div className="gallery-body">
          <Flex
              width="100vw"
              direction="column"
              justifyContent="flex-start"
              alignItems="center"
              alignContent="center"
              gap="1rem"
          >
            <Heading fontWeight="bold" color="font.primary" level={1}>Image Gallery</Heading>
            <Divider orientation="horizontal" color="blue"/>
            <Collection
                width={"90vw"}
                type="list"
                direction="row"
                wrap="wrap"
                items={images}
                isPaginated
                itemsPerPage={8}
            >
              {(image) => (
                  <Card color={"whitesmoke"} maxWidth="20vw" width="27%" backgroundColor="grey" padding="0"
                        variation="outlined" key={image.key}>
                    <Flex direction="row" alignItems="flex-start">
                      <Image
                          objectFit="cover"
                          alt="Road to milford sound"
                          src={image.imageUrl}
                          height="35rem"
                          width={"100%"}
                      />
                    </Flex>
                  </Card>
              )}
            </Collection>
          </Flex>

        </div>
      </div>
  );
}

export default App;