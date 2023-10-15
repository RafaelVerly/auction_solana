import * as borsh from '@project-serum/borsh'

export class Auction {
    /*
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    asset_token: String,
    asset_percentage: u16,
    rent_cost: u16,
    max_rate: u16,
    price: u16,
    description_asset: String, 
    */
    asset_token: string;
    asset_percentage: number;
    rent_cost: number;
    max_rate: number;
    price: number;
    description_asset: string;

    constructor(
        asset_token: string,
        asset_percentage: number,
        rent_cost: number,
        max_rate: number,
        price: number,
        description_asset: string,
    ) {
        this.asset_token = asset_token;
        this.asset_percentage = asset_percentage;
        this.rent_cost = rent_cost;
        this.max_rate = max_rate;
        this.price = price;
        this.description_asset = description_asset;
    }
/*
    static mocks: Auction[] = [
        new Auction('The Shawshank Redemption', 5, `For a Auction shot entirely in prison where there is no hope at all, shawshank redemption's main massage and purpose is to remind us of hope, that even in the darkest places hope exists, and only needs someone to find it. Combine this message with a brilliant screenplay, lovely characters and Martin freeman, and you get a Auction that can teach you a lesson everytime you watch it. An all time Classic!!!`),
        new Auction('The Godfather', 5, `One of Hollywood's greatest critical and commercial successes, The Godfather gets everything right; not only did the Auction transcend expectations, it established new benchmarks for American cinema.`),
        new Auction('The Godfather: Part II', 4, `The Godfather: Part II is a continuation of the saga of the late Italian-American crime boss, Francis Ford Coppola, and his son, Vito Corleone. The story follows the continuing saga of the Corleone family as they attempt to successfully start a new life for themselves after years of crime and corruption.`),
        new Auction('The Dark Knight', 5, `The Dark Knight is a 2008 superhero film directed, produced, and co-written by Christopher Nolan. Batman, in his darkest hour, faces his greatest challenge yet: he must become the symbol of the opposite of the Batmanian order, the League of Shadows.`),
    ]
*/
    borshInstructionSchema = borsh.struct([
        borsh.u8('variant'),
        borsh.str('asset_token'),
        borsh.u16('asset_percentage'),
        borsh.u16('rent_cost'),
        borsh.u16('max_rate'),
        borsh.u16('price'),
        borsh.str('description_asset'),
    ])

    static borshAccountSchema = borsh.struct([
        borsh.bool('initialized'),
        borsh.u16('highest_bid'),
        borsh.publicKey('pub_key_winner'),
        borsh.publicKey('pub_key_auction_owner'),
        borsh.str('asset_token'),
        borsh.u16('asset_percentage'),
        borsh.u16('rent_cost'),
        borsh.u16('max_rate'),
        borsh.u16('price'),
        borsh.str('description_asset'),
        borsh.u8('rating'),
        borsh.str('title'),
        borsh.str('description'),
    ])

    serialize(): Buffer {
        const buffer = Buffer.alloc(1000)
        this.borshInstructionSchema.encode({ ...this, variant: 0 }, buffer)
        return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer))
    }

    static deserialize(buffer?: Buffer): Auction | null {
        if (!buffer) {
            return null
        }

        try {
            const { asset_token, asset_percentage, rent_cost,  max_rate, price, description_asset} = this.borshAccountSchema.decode(buffer)
            return new Auction(asset_token, asset_percentage, rent_cost,  max_rate, price, description_asset)
        } catch (e) {
            console.log('Deserialization error:', e)
            console.log(buffer)
            return null
        }
    }
}