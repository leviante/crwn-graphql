//it's called resolvers because it is this object that we can pass to our client that lets it know what values to resolve depending on the queries and mutations
import { gql } from "apollo-boost";

import { addItemToCart, getCartItemCount } from "./cart.utils";

//define the schema that this local side is going to use
export const typeDefs = gql`

    extend type Item {
        quantity: Int
    }

    extend type Mutation {
        ToggleCartHidden: Boolean!
        AddItemToCart(item: Item!): [Item]!
    }
`;

const GET_CART_HIDDEN = gql`
    {
        cartHidden @client
    }
`;

const GET_ITEM_COUNT = gql`
    {
        itemCount @client
    }
`;

const GET_CART_ITEMS = gql`
    {
        cartItems @client
    }
`

export const resolvers = {
    Mutation: {
        toggleCartHidden: (_root, _args, { cache }, _info) => {
            const { cartHidden } = cache.readQuery({
                query: GET_CART_HIDDEN
            });

            cache.writeQuery({
                query: GET_CART_HIDDEN,
                data: { cartHidden: !cartHidden }
            });

            return !cartHidden;
        },
        
        addItemToCart: (_root, { item }, { cache }, _info) => {
           const { cartItems } = cache.readQuery({
                query: GET_CART_ITEMS
           });

           const newCartItems = addItemToCart(cartItems, item);

           cache.writeQuery({
            query: GET_ITEM_COUNT,
            data: { itemCount: getCartItemCount(newCartItems) }
           });

           cache.writeQuery({
                query: GET_CART_ITEMS,
                data: { cartItems: newCartItems }
           });

           return newCartItems;
        }
    }
}
