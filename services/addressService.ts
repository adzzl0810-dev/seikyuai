// Using a public API for Japan Zip Codes (zipcloud)
// Note: This API uses JSONP or CORS. We will use a fetch wrapper.

export const fetchAddressByZip = async (zip: string): Promise<string | null> => {
  // Remove hyphens
  const cleanZip = zip.replace(/-/g, '');
  if (cleanZip.length !== 7) return null;

  try {
    const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanZip}`);
    const data = await response.json();

    if (data.status === 200 && data.results && data.results.length > 0) {
      const result = data.results[0];
      return `${result.address1}${result.address2}${result.address3}`;
    }
    return null;
  } catch (e) {
    console.error("Address fetch failed", e);
    return null;
  }
};