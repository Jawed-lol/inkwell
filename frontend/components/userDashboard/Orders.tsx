export default function Orders() {
    const mockOrders = [
        { id: 1, item: "Book A", date: "2025-04-01", price: 10 },
        { id: 2, item: "Book B", date: "2025-04-02", price: 15 },
    ]

    return (
        <div className='max-w-4xl mx-auto bg-deepGray p-4 rounded-lg shadow-lg'>
            <h2 className='text-xl sm:text-2xl font-bold mb-4 text-center md:text-left text-warmBeige'>
                Order History
            </h2>
            <div className='overflow-x-auto'>
                <table className='w-full text-sm sm:text-base text-left text-mutedSand'>
                    <thead className='bg-slightlyLightGrey'>
                        <tr>
                            <th className='p-2 sm:p-3'>Order ID</th>
                            <th className='p-2 sm:p-3'>Item</th>
                            <th className='p-2 sm:p-3'>Date</th>
                            <th className='p-2 sm:p-3'>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockOrders.map((order) => (
                            <tr
                                key={order.id}
                                className='border-b border-burntAmber/20'>
                                <td className='p-2 sm:p-3'>{order.id}</td>
                                <td className='p-2 sm:p-3'>{order.item}</td>
                                <td className='p-2 sm:p-3'>{order.date}</td>
                                <td className='p-2 sm:p-3'>${order.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
