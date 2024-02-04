const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(err => next(err)); //next middleware ko execute krdo ,first middleware mei error hai. 
  };
};

export { asyncHandler };


//approach 2
//const asyncHandler=(func)=>{()=>{}}
// const asyncHandler = func => async (req, res, next) => {
//   try {
//     await func(req, res, next);
//   } catch (error) {
//     res.status(error.code || 500).json({
//         success:false,
//         message:error.message
//     })
//   }
// };
