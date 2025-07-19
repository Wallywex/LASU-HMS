import axios, { AxiosError } from "axios"

export async function Post(url: string, formData: Record<string, unknown>, state?: (loading: boolean) => void) {
  try {
    if (state) state(true)
    const { data } = await axios.post(url, formData)
    if (data && !("err" in data)) {
      return { data, err: null }
    } else {
      return { data: null, err: data.err }
    }
  } catch (error) {
    console.log(error)
    if (error instanceof AxiosError) {
      if (error.response && error.response.data.err) {
        return { data: null, err: error.response.data.err }
      }
      return { data: null, err: error.message }
    } else {
      return { data: null, err: "Something went wrong" }
    }
  } finally {
    if (state) state(false)
  }
}

export async function Get(url: string, state?: (loading: boolean) => void) {
  try {
    if (state) state(true)
    const { data } = await axios.get(url)
    if (data && !("err" in data)) {
      return { data, err: null }
    } else {
      return { data: null, err: data.err }
    }
  } catch (error) {
    console.log(error)
    if (error instanceof AxiosError) {
      if (error.response && error.response.data.err) {
        return { data: null, err: error.response.data.err }
      }
      return { data: null, err: error.message }
    } else {
      return { data: null, err: "Something went wrong" }
    }
  } finally {
    if (state) state(false)
  }
}

