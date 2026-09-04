import { computed, inject } from "@angular/core";
import { Product } from "./models/product";
import { patchState, signalMethod, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { produce } from "immer";
import { Toaster } from "./services/toaster";
import { CartItem } from "./models/cart";
import { MatDialog } from "@angular/material/dialog";
import { SignInDialog } from "./components/sign-in-dialog/sign-in-dialog";
import { SignInParams, SignUpParams, User } from "./models/user";
import { Router } from "@angular/router";
import { Order } from "./models/order";
import { withStorageSync } from "@angular-architects/ngrx-toolkit";

export type EcommerceState = {
    products: Product[];
    category: string;
    wishListItems: Product[];
    cartItems: CartItem[];
    user: User | undefined;
    loading: boolean;
    selectedProductId: string | undefined;
}

export const EcommerceStore = signalStore(
    {
        providedIn: 'root',
    },
    withState({
        products: [
            {
                id: "1",
                name: "Wireless Headphones",
                description: "Noise-cancelling wireless headphones with premium sound quality.",
                price: 129.99,
                imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
                rating: 4.7,
                reviewCount: 342,
                inStock: true,
                category: "electronics",
            },
            {
                id: "2",
                name: "Smart Watch",
                description: "Modern smartwatch with fitness tracking, heart rate monitoring, and notifications.",
                price: 199.99,
                imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
                rating: 4.5,
                reviewCount: 218,
                inStock: true,
                category: "electronics",
            },
            {
                id: "3",
                name: "Running clothing",
                description: "Lightweight and comfortable running clothing designed for everyday workouts.",
                price: 89.99,
                imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
                rating: 4.6,
                reviewCount: 156,
                inStock: true,
                category: "clothing",
            },
            {
                id: "4",
                name: "Leather Backpack",
                description: "Stylish leather backpack with multiple compartments for work and travel.",
                price: 74.99,
                imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
                rating: 4.4,
                reviewCount: 97,
                inStock: true,
                category: "clothing",
            },
            {
                id: "5",
                name: "Classic Sunglasses",
                description: "Classic sunglasses with UV protection and a stylish lightweight frame.",
                price: 49.99,
                imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
                rating: 4.3,
                reviewCount: 84,
                inStock: false,
                category: "accessories",
            },
            {
                id: "6",
                name: "Mechanical Keyboard",
                description: "RGB mechanical keyboard with responsive switches and customizable lighting.",
                price: 109.99,
                imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
                rating: 4.8,
                reviewCount: 431,
                inStock: true,
                category: "electronics",
            },
            {
                id: "7",
                name: "Ceramic Coffee Mug",
                description: "Minimal ceramic coffee mug perfect for coffee, tea, and hot beverages.",
                price: 19.99,
                imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d",
                rating: 4.6,
                reviewCount: 73,
                inStock: true,
                category: "home",
            },
            {
                id: "8",
                name: "Portable Bluetooth Speaker",
                description: "Compact Bluetooth speaker with powerful sound and long-lasting battery.",
                price: 59.99,
                imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
                rating: 4.5,
                reviewCount: 189,
                inStock: true,
                category: "electronics",
            },
            {
                id: "9",
                name: "Cotton Hoodie",
                description: "Soft and comfortable cotton hoodie suitable for casual everyday wear.",
                price: 44.99,
                imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
                rating: 4.4,
                reviewCount: 126,
                inStock: true,
                category: "clothing",
            },
            {
                id: "10",
                name: "Minimal Desk Lamp",
                description: "Modern LED desk lamp with adjustable brightness for work and study.",
                price: 34.99,
                imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
                rating: 4.7,
                reviewCount: 112,
                inStock: true,
                category: "home",
            },
        ],
        category: 'all',
        wishListItems: [],
        cartItems: [],
        user: undefined,
        loading: false,
        selectedProductId: undefined,
    } as EcommerceState),
    withStorageSync({
        key: 'modern-store', select:
            ({ wishListItems, cartItems, user }) => ({ wishListItems, cartItems, user })
    }),
    withComputed(({ category, products, wishListItems, cartItems, selectedProductId }) => ({
        filteredProducts: computed(() => {
            if (category() === 'all') return products();

            return products().filter((p) => p.category === category().toLowerCase())
        }),
        wishListCount: computed(() => wishListItems().length),
        cartCount: computed(() => cartItems().reduce((acc, item) => acc + item.quantity, 0)),
        selectedProduct: computed(() => products().find(p => p.id === selectedProductId()))
    })),
    withMethods((store, toaster = inject(Toaster), matDialog = inject(MatDialog), router = inject(Router)) => ({
        setCategory: signalMethod<string>((category: string) => {
            patchState(store, { category });
        }),
        setProductId: signalMethod<string>((productId: string) => {
            patchState(store, { selectedProductId: productId });
        }),
        addToWhishList: (product: Product) => {
            const updateWhishListItem = produce(store.wishListItems(), (draft) => {
                if (!draft.find(p => p.id === product.id)) {
                    draft.push(product);
                }
            });

            patchState(store, { wishListItems: updateWhishListItem });
            toaster.success('product added to whishlist');
        },
        removeFromWhishList: (product: Product) => {
            patchState(store, { wishListItems: store.wishListItems().filter(p => p.id !== product.id) });
            toaster.success('product removed from whishlist');
        },
        clearWhishList: () => {
            patchState(store, { wishListItems: [] });
        },
        addToCart: (product: Product, quantity = 1) => {
            const existingItemIndex = store.cartItems().findIndex(item => item.product.id === product.id);

            const updatedCartItems = produce(store.cartItems(), (draft) => {
                if (existingItemIndex !== -1) {
                    draft[existingItemIndex].quantity += quantity;
                    return;
                }

                draft.push({ product, quantity });
            })
            patchState(store, { cartItems: updatedCartItems });
            toaster.success(existingItemIndex !== -1 ? 'Product added again' : 'Product added to the cart');
        },
        setItemQuantity: (param: { productId: string; quantity: number }) => {
            const index = store.cartItems().findIndex(item => item.product.id === param.productId);
            const updated = produce(store.cartItems(), (draft) => {
                draft[index].quantity = param.quantity;
            });

            patchState(store, { cartItems: updated });
        },
        addAllWishListToCart: () => {
            const updated = produce(store.cartItems(), (draft) => {
                store.wishListItems().forEach(p => {
                    if (!draft.find(item => item.product.id === p.id)) {
                        draft.push({ product: p, quantity: 1 });
                    }
                })
            })

            patchState(store, { cartItems: updated, wishListItems: [] });
        },
        moveToWishList: (product: Product) => {
            const updatedCartItems = store.cartItems().filter(item => item.product.id !== product.id);
            const updatedWishListItems = produce(store.wishListItems(), (draft) => {
                if (!draft.find(p => p.id === product.id)) {
                    draft.push(product);
                }
            });

            patchState(store, { cartItems: updatedCartItems, wishListItems: updatedWishListItems });
        },
        removeFromCart: (product: Product) => {
            patchState(store, { cartItems: store.cartItems().filter(item => item.product.id !== product.id) });
        },
        proceedToCheckout: () => {
            if (!store.user()) {
                matDialog.open(SignInDialog, {
                    disableClose: true,
                    data: {
                        checkout: true
                    }
                })
                return;
            } else {
                router.navigate(['/checkout']);
            }
        },
        signIn: ({ email, password, checkout, dialogId }: SignInParams) => {
            patchState(store,
                {
                    user: {
                        id: '1', email, name: 'John Doe', imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
                    }
                });

            matDialog.getDialogById(dialogId)?.close();

            if (checkout) {
                router.navigate(['/checkout']);
            }
        },
        signOut: () => {
            patchState(store, { user: undefined });
        },
        signUp: ({ email, password, name, checkout, dialogId }: SignUpParams) => {
            patchState(store,
                {
                    user: {
                        id: '1', email, name: 'John Doe', imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
                    }
                });

            matDialog.getDialogById(dialogId)?.close();

            if (checkout) {
                router.navigate(['/checkout']);
            }
        },
        placeOrder: async () => {
            patchState(store, { loading: true });

            const user = store.user();

            if (!user) {
                toaster.error('please login to place the order');
                patchState(store, { loading: false });
                return;
            }

            const order: Order = {
                id: crypto.randomUUID(),
                userId: user.id || '',
                total: Math.round(store.cartItems().reduce((acc, item) => acc + (item.product.price * item.quantity), 0)),
                items: store.cartItems(),
                paymentStatus: 'success'
            };

            await new Promise(resolve => setTimeout(resolve, 1000));
            patchState(store, { cartItems: [], loading: false });
            router.navigate(['/order-success']);
        }
    }))
)