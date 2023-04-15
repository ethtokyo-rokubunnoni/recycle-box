import { Button, Checkbox, Stack, Box, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Spinner, CircularProgress, Image, } from '@chakra-ui/react';
import { Utils } from 'alchemy-sdk';
import { useState, useEffect } from 'react';

export function CheckBox({ tokenList, hideChecked, onModalActionCompleted, setHeaderText }) {
  const checked = [];
  if (tokenList) {
    Object.keys(tokenList).map((keyname, i) => {
      let n = tokenList[keyname].tokens.length;
      checked.push(new Array(n).fill(false));
    });
  }

  let recycleTokens = [];

  const recycle = () => {
    if (tokenList) {
      Object.keys(tokenList).map((keyname, i) => {
        tokenList[keyname].tokens.map((e, j) => {
          if (checked[i][j]) {
            recycleTokens.push(e);
          }
        });
      });
      console.log(recycleTokens);
    }
    setIsOpen(true);
  };

  const [modalState, setModalState] = useState({
    headerText: "Recycling Now",
    spinner: true,
    bodyText: "Wait for a second...",
  });

  const handleModalActionCompleted = () => {
    setHeaderText("Recycling Completed");
    onModalActionCompleted();
  };

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setTimeout(() => {
        handleModalActionCompleted();
        setModalState({
          headerText: "Recycling Completed",
          spinner: false,
          bodyText: "Recycling has been completed!",
          imageURL: "/assets/mottainai.png"
        });
      }, 2000); // 2sec finish
    }

    return () => {
      clearTimeout(timer); // クリーンアップ関数でタイマーを解除
    };
  }, [isOpen]);

  return (
    <>
      {tokenList &&
        Object.keys(tokenList).map((keyname, i) => {
          let n = tokenList[keyname].tokens.length;
          const [checkedItems, setCheckedItems] = useState(new Array(n).fill(false));
          const allChecked = checkedItems.every(Boolean);
          const isIndeterminate = checkedItems.some(Boolean) && !allChecked;
          checked[i] = checkedItems;
          return (
            <>
              <Checkbox
                key={keyname}
                isChecked={allChecked}
                isIndeterminate={isIndeterminate}
                onChange={(e) =>
                  setCheckedItems([e.target.checked, e.target.checked, e.target.checked])
                }
              >
                {keyname}
              </Checkbox>
              <Stack pl={6} mt={1} spacing={1}>
                {tokenList[keyname].tokens.map((e, j) => {
                  console.log(e);
                  return (
                    !hideChecked || !checkedItems[j] ? (
                      <Checkbox
                        key={e.symbol}
                        isChecked={checkedItems[j]}
                        onChange={(a) => {
                          setCheckedItems((checkedItems) => {
                            return checkedItems.map((item, k) => {
                              return k === j ? a.target.checked : item;
                            });
                          });
                        }}
                      >
                        {e.data.symbol} {Utils.formatUnits(e.balance.tokenBalance, e.data.decimals)}
                      </Checkbox>
                    ) : null
                  );
                })}
              </Stack>
            </>
          );
        })}
      <Box mt={6}>
        <Button onClick={() => recycle()}>Recycle</Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent position="absolute" top="200px">
          <Box align="center">
            <ModalHeader>{modalState.headerText}</ModalHeader>
            <ModalCloseButton />
            {modalState.spinner && (
              <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='xl'
              />
            )}
            {!modalState.spinner && (
              <Image src={modalState.imageUrl} alt="image" boxSize="30%" mb="-6"  />
            )}

            <ModalBody>
              <Text>{modalState.bodyText}</Text>
            </ModalBody>
          </Box>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
