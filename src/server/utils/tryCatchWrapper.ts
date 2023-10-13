/**
* A wrapper for try catch blocks. The wrapper will execute the function and if it fails, it will throw an error with the error message specified. If a custom error function is specified, it will be called with the error as the parameter. This is useful to catch errors and throw them to the frontend to be shown as an error toast.
 * 
 * @param fn The function to execute
 * @param errorMessage The error message to throw if the function fails
 * @param customErrorFunction A custom error function to execute if the function fails
 * 
 * @returns The result of the function
 * 
 * @example Examples can be found in https://comp30022team.atlassian.net/l/cp/GFjsEGjy
 */
export async function tryCatchWrapper<T>(
  fn: () => Promise<T>,
  errorMessage?: string,
  customErrorFunction?: (err: any) => void
) {
  try {
    const result = await fn();
    return result;
  } catch (err: any) {
    if (customErrorFunction) {
      customErrorFunction(err);
    }
    throw new Error(`${errorMessage ? errorMessage + " " : ""}Error: ${err}`);
  }
}
