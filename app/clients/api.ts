import { fetchAuthSession } from 'aws-amplify/auth';
import axios from 'axios';
import { useEffect, useState } from 'react';

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

/**
 * Sends a request to the specified URL using the specified HTTP method.
 * @param method - The HTTP method to use for the request.
 * @param url - The URL to send the request to.
 * @param data - The data to send with the request (optional).
 * @returns A Promise that resolves to the response data.
 */
const sendRequest = async (method: Method, url: string = '', data?: any) => {
  const { tokens } = await fetchAuthSession();
  const fullURL = window.location.origin.includes('localhost') ? `http://localhost:3000/${url}` : `${import.meta.env.VITE_API_FQDN}/${url}`;

  const config = {
    headers: {
      Authorization: tokens?.idToken && `Bearer ${tokens!.idToken}`,
    },
  };

  try {
    let response;
    switch (method) {
      case Method.GET:
        response = await axios.get(fullURL, { params: data, ...config });
        break;
      case Method.POST:
        response = await axios.post(fullURL, data, config);
        break;
      case Method.PUT:
        response = await axios.put(fullURL, data, config);
        break;
      case Method.PATCH:
        response = await axios.patch(fullURL, data, config);
        break;
      case Method.DELETE:
        response = await axios.delete(fullURL, config);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
    return response.data;
  } catch (error) {
    console.error(`Error in sendRequest (${method} ${url}):`, error);
    throw error;
  }
};

/**
 * Custom hook for making API requests.
 *
 * @param method - The HTTP method for the request.
 * @param dependencies - Additional dependencies to include in the useEffect hook.
 * @param url - The URL for the API request.
 * @param postData - The data to be sent in the request body.
 * @returns An object containing the response data, loading state, and error state.
 */
const useAPI = (method: Method, dependencies: any[], url?: string, postData?: any) => {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await sendRequest(method, url, postData);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, method, postData, ...dependencies]);

  return { data, loading, error };
};

export { sendRequest, useAPI };
