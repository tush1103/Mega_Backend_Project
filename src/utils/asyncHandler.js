const asyncHandler = requestHanler => {
  (req, res, next) => {
    Promise.resolve(requestHanler(req, res, next)).catch(err => next(err));
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
