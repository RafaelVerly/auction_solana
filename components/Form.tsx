import { FC } from 'react'
import { Auction } from '../models/Auction'
import { useState } from 'react'
import { Box, Button, FormControl, FormLabel, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Textarea } from '@chakra-ui/react'
import * as web3 from '@solana/web3.js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

const MOVIE_REVIEW_PROGRAM_ID = '79Q6AZeAbfViA3j89mL5YB6rszBHzfMc2cNdWzheeWnP'

export const Form: FC = () => {
    
    const [asset_token, setAssetToken] = useState('')
    const [asset_percentage, setAssetPercentage] = useState(0)
    const [rent_cost, setRentCost] = useState(0)
    const [max_rate, setMaxRate] = useState(0)
    const [price, setPrice] = useState(0)
    const [description_asset, setDescriptionAsset] = useState('')


    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const handleSubmit = (event: any) => {
        event.preventDefault()
        const auction = new Auction(asset_token, asset_percentage, rent_cost,  max_rate, price, description_asset)
        handleTransactionSubmit(auction)
    }

    const handleTransactionSubmit = async (auction: Auction) => {
        if (!publicKey) {
            alert('Please connect your wallet!')
            return
        }

        const buffer = auction.serialize()
        const transaction = new web3.Transaction()

        const [pda] = await web3.PublicKey.findProgramAddress(
            [publicKey.toBuffer(), Buffer.from(auction.asset_token)],// new TextEncoder().encode(movie.title)],
            new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
        )

        const instruction = new web3.TransactionInstruction({
            keys: [
                {
                    pubkey: publicKey,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: pda,
                    isSigner: false,
                    isWritable: true
                },
                {
                    pubkey: web3.SystemProgram.programId,
                    isSigner: false,
                    isWritable: false
                }
            ],
            data: buffer,
            programId: new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
        })

        transaction.add(instruction)
        console.log("até aqui ok"  + asset_token)
        try {
            let txid = await sendTransaction(transaction, connection)
            alert(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`)
            console.log(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`)
        } catch (e) {
            console.log(JSON.stringify(e))
            alert(JSON.stringify(e))
        }
    }

    return (
        <Box
            p={4}
            display={{ md: "flex" }}
            maxWidth="32rem"
            borderWidth={1}
            margin={2}
            justifyContent="center"
        >
            <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                    <FormLabel color='gray.200'>
                        Asset Token
                    </FormLabel>
                    <Input
                        id='title'
                        color='gray.400'
                        onChange={event => setAssetToken(event.currentTarget.value)}
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel color='gray.200'>
                        Asset Percentage
                    </FormLabel>
                    <NumberInput
                        max={10}
                        min={1}
                        onChange={(valueString) => setAssetPercentage(parseInt(valueString))}
                    >
                        <NumberInputField id='amount' color='gray.400' />
                        <NumberInputStepper color='gray.400'>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel color='gray.200'>
                        Rent Cost
                    </FormLabel>
                    <NumberInput
                        max={200}
                        min={1}
                        onChange={(valueString) => setRentCost(parseInt(valueString))}
                    >
                        <NumberInputField id='amount' color='gray.400' />
                        <NumberInputStepper color='gray.400'>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel color='gray.200'>
                        Max Rate
                    </FormLabel>
                    <NumberInput
                        max={10}
                        min={1}
                        onChange={(valueString) => setMaxRate(parseInt(valueString))}
                    >
                        <NumberInputField id='amount' color='gray.400' />
                        <NumberInputStepper color='gray.400'>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel color='gray.200'>
                        Price
                    </FormLabel>
                    <NumberInput
                        max={1000}
                        min={1}
                        onChange={(valueString) => setPrice(parseInt(valueString))}
                    >
                        <NumberInputField id='amount' color='gray.400' />
                        <NumberInputStepper color='gray.400'>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel color='gray.200'>
                        Description Asset
                    </FormLabel>
                    <Textarea
                        id='review'
                        color='gray.400'
                        onChange={event => setDescriptionAsset(event.currentTarget.value)}
                    />
                </FormControl>
                
                <Button width="full" mt={4} type="submit">
                    Submit Review
                </Button>
            </form>
        </Box>
    );
}