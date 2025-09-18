import { zodResolver } from '@hookform/resolvers/zod';
import { Editor } from '@monaco-editor/react';
import {
  BookOpen,
  CheckCircle2,
  Code2,
  Download,
  FileText,
  Lightbulb,
  Plus,
  Trash2,
} from 'lucide-react';
import React, { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { problemSchema } from '../schemas/problemSchema';
import { useProblemStore } from '../store/useProblemStore';

const sampledpData = {
  title: 'Climbing Stairs',
  description:
    'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
  difficulty: 'EASY',
  tags: ['Dynamic Programming', 'Math', 'Memoization'],
  constraints: '1 <= n <= 45',
  hints:
    'To reach the nth step, you can either come from the (n-1)th step or the (n-2)th step.',
  editorial:
    'This is a classic dynamic programming problem.',
  testcases: [
    { input: '2', output: '2' },
    { input: '3', output: '3' },
    { input: '4', output: '5' },
  ],
  examples: {
    PYTHON: { input: 'n = 3', output: '3', explanation: 'Three ways to climb.' },
    JAVA: { input: 'n = 4', output: '5', explanation: 'Five ways to climb.' },
    C: { input: 'n = 2', output: '2', explanation: 'Two ways to climb.' },
    CPP: { input: 'n = 3', output: '3', explanation: 'Three ways to climb.' },
  },
  codeSnippets: {
    PYTHON: 'def solution():\n    pass',
    JAVA: 'public class Solution {\n    public static void main(String[] args) {}\n}',
    C: '#include <stdio.h>\nint main() {\n    return 0;\n}',
    CPP: '#include <iostream>\nint main() {\n    return 0;\n}',
  },
  userId: '4a177013-e860-4262-9155-fb9c3b9bec6f', // Placeholder; replace with auth user ID
};

const sampleStringProblem = {
  title: 'Valid Palindrome',
  description:
    'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string s, return true if it is a palindrome, or false otherwise.',
  difficulty: 'EASY',
  tags: ['String', 'Two Pointers'],
  constraints:
    '1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.',
  hints:
    'Consider using two pointers, one from the start and one from the end.',
  editorial:
    'We can use two pointers approach to check if the string is a palindrome.',
  testcases: [
    { input: 'A man, a plan, a canal: Panama', output: 'true' },
    { input: 'race a car', output: 'false' },
    { input: ' ', output: 'true' },
  ],
  examples: {
    PYTHON: { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: 'Is a palindrome.' },
    JAVA: { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: 'Is a palindrome.' },
    C: { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: 'Is a palindrome.' },
    CPP: { input: 's = "race a car"', output: 'false', explanation: 'Not a palindrome.' },
  },
  codeSnippets: {
    PYTHON: 'class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        pass',
    JAVA: 'public class Main {\n    public static boolean isPalindrome(String s) {}\n}',
    C: '#include <stdbool.h>\nbool isPalindrome(char * s) {\n    return false;\n}',
    CPP: 'bool isPalindrome(string s) {\n    return false;\n}',
  },
  userId: 'sample-user-id', // Placeholder
};

const CreateProblemForm = () => {
  const [sampleType, setSampleType] = useState('DP');
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      testcases: [{ input: '', output: '' }],
      tags: [''],
      examples: {
        PYTHON: { input: '', output: '', explanation: '' },
        JAVA: { input: '', output: '', explanation: '' },
        C: { input: '', output: '', explanation: '' },
        CPP: { input: '', output: '', explanation: '' },
      },
      codeSnippets: {
        PYTHON: 'def solution():\n    pass',
        JAVA: 'public class Solution {\n    public static void main(String[] args) {}\n}',
        C: '#include <stdio.h>\nint main() {\n    return 0;\n}',
        CPP: '#include <iostream>\nint main() {\n    return 0;\n}',
      },
      userId: '', // Add userId field
    },
  });

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
    replace: replaceTestCases,
  } = useFieldArray({ control, name: 'testcases' });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
    replace: replaceTags,
  } = useFieldArray({ control, name: 'tags' });

  const { createProblem } = useProblemStore();

  const onSubmit = async (value) => {
    console.log('Form values:', value);
    try {
      const result = await createProblem(value);
      console.log('Create result:', result);
      if (result.success) {
        toast.success('Problem created successfully');
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      toast.error('Failed to create problem');
    }
  };

  const loadSampleData = () => {
    const sampleData = sampleType === 'DP' ? sampledpData : sampleStringProblem;
    replaceTags(sampleData.tags.map((tag) => tag));
    replaceTestCases(sampleData.testcases.map((tc) => tc));
    reset(sampleData);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 pb-4 border-b">
            <h3 className="card-title text-2xl md:text-3xl flex items-center gap-3">
              <FileText className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              Create Problem
            </h3>
            <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-3">
              <select
                className="select select-bordered w-full md:w-auto max-w-xs"
                value={sampleType}
                onChange={(e) => setSampleType(e.target.value)}
              >
                <option value="DP">Dynamic Programming</option>
                <option value="STRING">String Problem</option>
              </select>
              <button className="btn btn-outline btn-primary" onClick={loadSampleData}>
                <Download className="w-4 h-4 mr-2" /> Load Sample Data
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="card bg-base-200 p-4 md:p-6 shadow-md">
              <h3 className="text-lg md:text-xl font-semibold mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-info" /> Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Title</span></label>
                  <input type="text" className="input input-bordered w-full" {...register('title')} placeholder="Enter problem title" />
                  {errors.title && <label className="label"><span className="label-text-alt text-error">{errors.title.message}</span></label>}
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Difficulty</span></label>
                  <select className="select select-bordered w-full" {...register('difficulty')}>
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                  {errors.difficulty && <label className="label"><span className="label-text-alt text-error">{errors.difficulty.message}</span></label>}
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">User ID</span></label>
                  <input type="text" className="input input-bordered w-full" {...register('userId')} placeholder="Enter user ID" />
                  {errors.userId && <label className="label"><span className="label-text-alt text-error">{errors.userId.message}</span></label>}
                </div>
              </div>
              <div className="form-control mt-4 md:mt-6">
                <label className="label"><span className="label-text font-medium">Description</span></label>
                <textarea className="textarea textarea-bordered min-h-32 w-full p-3 resize-y" {...register('description')} placeholder="Enter problem description" />
                {errors.description && <label className="label"><span className="label-text-alt text-error">{errors.description.message}</span></label>}
              </div>
            </div>

            {/* Tags */}
            <div className="card bg-base-200 p-4 md:p-6 shadow-md">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2"><BookOpen className="w-5 h-5" /> Tags</h3>
                <button type="button" className="btn btn-primary btn-sm mt-4 md:mt-0" onClick={() => appendTag('')}>
                  <Plus className="w-4 h-4 mr-1" /> Add Tag
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {tagFields.map((field, index) => (
                  <div key={field.id} className="form-control flex-row items-center gap-2">
                    <input type="text" className="input input-bordered flex-1" {...register(`tags.${index}`)} placeholder="Enter tag" />
                    <button type="button" className="btn btn-ghost btn-sm text-error" onClick={() => removeTag(index)} disabled={tagFields.length === 1}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              {errors.tags && !Array.isArray(errors.tags) && <div className="mt-2"><span className="text-error text-sm">{errors.tags.message}</span></div>}
            </div>

            {/* Test Cases */}
            <div className="card bg-base-200 p-4 md:p-6 shadow-md">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Test Cases</h3>
                <button type="button" className="btn btn-primary btn-sm mt-4 md:mt-0" onClick={() => appendTestCase({ input: '', output: '' })}>
                  <Plus className="w-4 h-4 mr-1" /> Add Test Case
                </button>
              </div>
              <div className="space-y-6">
                {testCaseFields.map((field, index) => (
                  <div key={field.id} className="card bg-base-100 shadow-md">
                    <div className="card-body p-4 md:p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-base md:text-lg font-semibold">Test Case #{index + 1}</h4>
                        <button type="button" className="btn btn-ghost btn-sm text-error" onClick={() => removeTestCase(index)} disabled={testCaseFields.length === 1}>
                          <Trash2 className="w-4 h-4 mr-1" /> Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="form-control">
                          <label className="label"><span className="label-text font-medium">Input</span></label>
                          <textarea className="textarea textarea-bordered min-h-24 w-full p-3 resize-y" {...register(`testcases.${index}.input`)} placeholder="Enter test case input" />
                          {errors.testcases?.[index]?.input && <label className="label"><span className="label-text-alt text-error">{errors.testcases[index].input.message}</span></label>}
                        </div>
                        <div className="form-control">
                          <label className="label"><span className="label-text font-medium">Expected Output</span></label>
                          <textarea className="textarea textarea-bordered min-h-24 w-full p-3 resize-y" {...register(`testcases.${index}.output`)} placeholder="Enter expected output" />
                          {errors.testcases?.[index]?.output && <label className="label"><span className="label-text-alt text-error">{errors.testcases[index].output.message}</span></label>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.testcases && !Array.isArray(errors.testcases) && <div className="mt-2"><span className="text-error text-sm">{errors.testcases.message}</span></div>}
            </div>

            {/* Code Editor Sections */}
            <div className="space-y-8">
              {['PYTHON', 'JAVA', 'C', 'CPP'].map((language) => (
                <div key={language} className="card bg-base-200 p-4 md:p-6 shadow-md">
                  <h3 className="text-lg md:text-xl font-semibold mb-6 flex items-center gap-2"><Code2 className="w-5 h-5" /> {language}</h3>
                  <div className="space-y-6">
                    {/* Starter Code */}
                    <div className="card bg-base-100 shadow-md">
                      <div className="card-body p-4 md:p-6">
                        <h4 className="font-semibold text-base md:text-lg mb-4">Starter Code Template</h4>
                        <div className="border rounded-md overflow-hidden">
                          <Controller
                            name={`codeSnippets.${language}`}
                            control={control}
                            render={({ field }) => (
                              <Editor
                                height="300px"
                                language={language.toLowerCase()}
                                theme="vs-dark"
                                value={field.value}
                                onChange={field.onChange}
                                options={{
                                  minimap: { enabled: false },
                                  fontSize: 14,
                                  lineNumbers: 'on',
                                  roundedSelection: false,
                                  scrollBeyondLastLine: false,
                                  automaticLayout: true,
                                }}
                              />
                            )}
                          />
                        </div>
                        {errors.codeSnippets?.[language] && <div className="mt-2"><span className="text-error text-sm">{errors.codeSnippets[language].message}</span></div>}
                      </div>
                    </div>

                    {/* Examples */}
                    <div className="card bg-base-100 shadow-md">
                      <div className="card-body p-4 md:p-6">
                        <h4 className="font-semibold text-base md:text-lg mb-4">Example</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="form-control">
                            <label className="label"><span className="label-text font-medium">Input</span></label>
                            <textarea className="textarea textarea-bordered min-h-20 w-full p-3 resize-y" {...register(`examples.${language}.input`)} placeholder="Example input" />
                            {errors.examples?.[language]?.input && <label className="label"><span className="label-text-alt text-error">{errors.examples[language].input.message}</span></label>}
                          </div>
                          <div className="form-control">
                            <label className="label"><span className="label-text font-medium">Output</span></label>
                            <textarea className="textarea textarea-bordered min-h-20 w-full p-3 resize-y" {...register(`examples.${language}.output`)} placeholder="Example output" />
                            {errors.examples?.[language]?.output && <label className="label"><span className="label-text-alt text-error">{errors.examples[language].output.message}</span></label>}
                          </div>
                          <div className="form-control md:col-span-2">
                            <label className="label"><span className="label-text font-medium">Explanation</span></label>
                            <textarea className="textarea textarea-bordered min-h-24 w-full p-3 resize-y" {...register(`examples.${language}.explanation`)} placeholder="Explain the example" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Information */}
            <div className="card bg-base-200 p-4 md:p-6 shadow-md">
              <h3 className="text-lg md:text-xl font-semibold mb-6 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-warning" /> Additional Information</h3>
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Constraints</span></label>
                  <textarea className="textarea textarea-bordered min-h-24 w-full p-3 resize-y" {...register('constraints')} placeholder="Enter problem constraints" />
                  {errors.constraints && <label className="label"><span className="label-text-alt text-error">{errors.constraints.message}</span></label>}
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Hints (Optional)</span></label>
                  <textarea className="textarea textarea-bordered min-h-24 w-full p-3 resize-y" {...register('hints')} placeholder="Enter hints for solving the problem" />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Editorial (Optional)</span></label>
                  <textarea className="textarea textarea-bordered min-h-32 w-full p-3 resize-y" {...register('editorial')} placeholder="Enter problem editorial/solution explanation" />
                </div>
              </div>
            </div>

            <div className="card-actions justify-end pt-4 border-t">
              <button type="submit" className="btn btn-primary btn-lg gap-2" disabled={isSubmitting}>
                {isSubmitting ? <span className="loading loading-spinner text-white"></span> : <>
                  <CheckCircle2 className="w-5 h-5" />
                  Create Problem
                </>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProblemForm;