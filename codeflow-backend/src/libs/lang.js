export function getLanguageId(lang) {
  switch (lang) {
    case 'PYTHON':
      return 116; // Python 3.8.0
    case 'JAVA':
      return 10; // Java JDK 13.0.1
    case 'C':
      return 1; // C GCC 9.2.0
    case 'CPP':
      return 41; // C++ GCC 9.2.0
    default:
      return 116; // Default to Python
  }
}