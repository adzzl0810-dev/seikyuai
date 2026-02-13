
export interface AddressResult {
    prefecture: string;
    city: string;
    town: string;
    fullAddress: string;
}

export const fetchAddressByZipCode = async (zipCode: string): Promise<AddressResult | null> => {
    // Remove hyphens
    const cleanZip = zipCode.replace(/-/g, '');
    if (cleanZip.length !== 7 || isNaN(Number(cleanZip))) {
        return null;
    }

    try {
        const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanZip}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            const prefecture = result.address1;
            const city = result.address2;
            const town = result.address3;
            return {
                prefecture,
                city,
                town,
                fullAddress: `${prefecture}${city}${town}`
            };
        }
        return null;
    } catch (error) {
        console.error('Failed to fetch address:', error);
        return null;
    }
};
