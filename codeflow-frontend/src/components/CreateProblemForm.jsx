import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
  editorial: 'This is a classic dynamic programming problem.',
  publicTestcases: [
    { input: "2", output: '2' },
    { input: "3", output: '3' },
    { input: "4", output: '5' },
  ],
  hiddenTestcases: [
    { input: '10', output: '89' },
    { input: '20', output: '10946' },
  ],
  examples: [
    { input: 'n = 3', output: '3', explanation: 'Three ways to climb.' },
    { input: 'n = 4', output: '5', explanation: 'Five ways to climb.' },
  ],
  codeSnippets: {
    PYTHON: 'def solution(n):\n    # implement\n    pass',
    JAVA: 'public class Solution {\n    public static void main(String[] args) {}\n}',
    C: '#include <stdio.h>\nint main() {\n    return 0;\n}',
    CPP: '#include <iostream>\nint main() {\n    return 0;\n}',
  },
  userId: '296f6e94-482f-48e0-a7e9-9ce38379a713', // Placeholder; replace with auth user ID
};

const sampleStringProblem = {
  title: 'Valid Palindrome',
  description:
    'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string s, return true if it is a palindrome, or false otherwise.',
  difficulty: 'EASY',
  tags: ['String', 'Two Pointers'],
  constraints:
    '1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.',
  editorial: 'Two pointers approach is optimal.',
  publicTestcases: [
    { input: 'A man, a plan, a canal: Panama', output: 'true' },
    { input: 'race a car', output: 'false' },
    { input: ' ', output: 'true' },
  ],
  hiddenTestcases: [
    { input: '.,', output: 'true' },
  ],
  examples: [
    { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: 'Is a palindrome.' },
    { input: 's = "race a car"', output: 'false', explanation: 'Not a palindrome.' },
  ],
  codeSnippets: {
    PYTHON: 'class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        pass',
    JAVA: 'public class Main {\n    public static boolean isPalindrome(String s) { return false; }\n}',
    C: '#include <stdbool.h>\nbool isPalindrome(char * s) { return false; }',
    CPP: 'bool isPalindrome(string s) { return false; }',
  },
  userId: '296f6e94-482f-48e0-a7e9-9ce38379a713', // Placeholder
};

const CreateProblemForm = () => {
  const [sampleType, setSampleType] = useState('DP');
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: '',
      description: '',
      difficulty: 'EASY',
      tags: [''],
      constraints: '',
      editorial: '',
      publicTestcases: [
        { input: '', output: '' },
        { input: '', output: '' },
        { input: '', output: '' },
      ],
      hiddenTestcases: [],
      examples: [
        { input: '', output: '', explanation: '' },
        { input: '', output: '', explanation: '' },
      ],
      codeSnippets: {
        PYTHON: 'def solution():\n    pass',
        JAVA: 'public class Solution {\n    public static void main(String[] args) {}\n}',
        C: '#include <stdio.h>\nint main() {\n    return 0;\n}',
        CPP: '#include <iostream>\nint main() {\n    return 0;\n}',
      },
      userId: '', // Add userId field; replace with auth logic
    },
  });

  // Field arrays
  const {
    fields: exampleFields,
    append: appendExample,
    remove: removeExample,
  } = useFieldArray({ control, name: 'examples' });

  const {
    fields: publicTestcaseFields,
    // No append/remove for publicTestcases (locked to 3)
  } = useFieldArray({ control, name: 'publicTestcases' });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({ control, name: 'hiddenTestcases' });

  const { createProblem } = useProblemStore();

const onSubmit = async (data) => {
  try {
    const processedData = {
  ...data,
  publicTestcases: data.publicTestcases.map(tc => ({
    input: tc.input || '',
    output: tc.output || '',
  })),
  hiddenTestcases: data.hiddenTestcases.map(tc => ({
    input: tc.input || '',
    output: tc.output || '',
  })),
  examples: data.examples.map(ex => ({
    input: ex.input || '',
    output: ex.output || '',
    explanation: ex.explanation || '',
  })),
  codeSnippets: {
    PYTHON: data.codeSnippets.PYTHON || '',
    JAVA: data.codeSnippets.JAVA || '',
    C: data.codeSnippets.C || '',
    CPP: data.codeSnippets.CPP || '',
  },
  userId: data.userId || '4fecb2dd-aaad-4e54-8819-73805d06f06e',
};

const validatedData = problemSchema.parse(processedData);

// send validatedData directly to API
const result = await createProblem(validatedData);

    if (result?.success) {
      toast.success('Problem created successfully');
      navigate('/');
    } else {
      toast.error('Failed to create problem');
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues?.[0];
      toast.error(firstIssue?.message || 'Validation failed');
      console.error('Validation issues:', error.issues);
    } else {
      console.error('Error:', error.response?.data || error.message);
      toast.error('Failed to create problem');
    }
  }
};



  const loadSampleData = () => {
    const sampleData = sampleType === 'DP' ? sampledpData : sampleStringProblem;
    reset({
      ...sampleData,
      tags: sampleData.tags, // Ensure tags is an array
    });
  };

  // Enforce constraints
  const examplesCount = watch('examples').length;
  if (examplesCount < 2) appendExample({ input: '', output: '', explanation: '' });
  if (examplesCount > 3) removeExample(3); // Limit to 3

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
                <button type="button" className="btn btn-primary btn-sm mt-4 md:mt-0" onClick={() => {
                  const tags = watch('tags') || [];
                  const newTags = [...tags, ''];
                  reset({ ...watch(), tags: newTags });
                }}>
                  <Plus className="w-4 h-4 mr-1" /> Add Tag
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {(watch('tags') || []).map((_, index) => (
                  <div key={index} className="form-control flex-row items-center gap-2">
                    <input type="text" className="input input-bordered flex-1" {...register(`tags.${index}`)} placeholder="Enter tag" />
                    <button type="button" className="btn btn-ghost btn-sm text-error" onClick={() => {
                      const tags = watch('tags') || [];
                      if (tags.length === 1) return;
                      const newTags = tags.filter((_, i) => i !== index);
                      reset({ ...watch(), tags: newTags });
                    }} disabled={(watch('tags') || []).length === 1}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              {errors.tags && !Array.isArray(errors.tags) && <div className="mt-2"><span className="text-error text-sm">{errors.tags.message}</span></div>}
            </div>

            {/* Public Test Cases (exactly 3) */}
            <div className="card bg-base-200 p-4 md:p-6 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Public Test Cases (3)</h3>
                <small className="text-sm opacity-70">Exactly 3 public testcases required</small>
              </div>
              <div className="space-y-4">
                {publicTestcaseFields.map((field, index) => (
                  <div key={field.id} className="card bg-base-100 shadow-md">
                    <div className="card-body p-4 md:p-6">
                      <h4 className="text-base md:text-lg font-semibold">Public Test Case #{index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-3">
                        <div className="form-control">
                          <label className="label"><span className="label-text font-medium">Input</span></label>
                          <textarea className="textarea textarea-bordered min-h-24 w-full p-3 resize-y" {...register(`publicTestcases.${index}.input`)} placeholder="Enter test case input" />
                          {errors.publicTestcases?.[index]?.input && <label className="label"><span className="label-text-alt text-error">{errors.publicTestcases[index].input.message}</span></label>}
                        </div>
                        <div className="form-control">
                          <label className="label"><span className="label-text font-medium">Expected Output</span></label>
                          <textarea className="textarea textarea-bordered min-h-24 w-full p-3 resize-y" {...register(`publicTestcases.${index}.output`)} placeholder="Enter expected output" />
                          {errors.publicTestcases?.[index]?.output && <label className="label"><span className="label-text-alt text-error">{errors.publicTestcases[index].output.message}</span></label>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.publicTestcases && <div className="mt-2"><span className="text-error text-sm">{errors.publicTestcases.message}</span></div>}
            </div>

            {/* Hidden Test Cases (optional) */}
            <div className="card bg-base-200 p-4 md:p-6 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Hidden Test Cases (optional)</h3>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => appendHidden({ input: '', output: '' })}>
                  <Plus className="w-4 h-4 mr-1" /> Add Hidden Test Case
                </button>
              </div>
              <div className="space-y-4">
                {hiddenFields.map((field, index) => (
                  <div key={field.id} className="card bg-base-100 shadow-md">
                    <div className="card-body p-4 md:p-6">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-base md:text-lg font-semibold">Hidden Test Case #{index + 1}</h4>
                        <button type="button" className="btn btn-ghost btn-sm text-error" onClick={() => removeHidden(index)}>
                          <Trash2 className="w-4 h-4 mr-1" /> Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="form-control">
                          <label className="label"><span className="label-text font-medium">Input</span></label>
                          <textarea className="textarea textarea-bordered min-h-24 w-full p-3 resize-y" {...register(`hiddenTestcases.${index}.input`)} placeholder="Enter hidden test case input" />
                          {errors.hiddenTestcases?.[index]?.input && <label className="label"><span className="label-text-alt text-error">{errors.hiddenTestcases[index].input.message}</span></label>}
                        </div>
                        <div className="form-control">
                          <label className="label"><span className="label-text font-medium">Expected Output</span></label>
                          <textarea className="textarea textarea-bordered min-h-24 w-full p-3 resize-y" {...register(`hiddenTestcases.${index}.output`)} placeholder="Enter expected output" />
                          {errors.hiddenTestcases?.[index]?.output && <label className="label"><span className="label-text-alt text-error">{errors.hiddenTestcases[index].output.message}</span></label>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.hiddenTestcases && <div className="mt-2"><span className="text-error text-sm">{errors.hiddenTestcases.message}</span></div>}
            </div>

            {/* Examples (2-3 total) */}
            <div className="card bg-base-200 p-4 md:p-6 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2"><BookOpen className="w-5 h-5" /> Examples (2-3)</h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      const exs = watch('examples') || [];
                      if (exs.length >= 3) return;
                      appendExample({ input: '', output: '', explanation: '' });
                    }}
                    disabled={examplesCount >= 3}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Example
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {exampleFields.map((field, index) => (
                  <div key={field.id} className="card bg-base-100 shadow-md">
                    <div className="card-body p-4 md:p-6">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-base md:text-lg font-semibold">Example #{index + 1}</h4>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm text-error"
                          onClick={() => removeExample(index)}
                          disabled={exampleFields.length <= 2}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="form-control">
                          <label className="label"><span className="label-text font-medium">Input</span></label>
                          <textarea className="textarea textarea-bordered min-h-20 w-full p-3 resize-y" {...register(`examples.${index}.input`)} placeholder="Example input" />
                          {errors.examples?.[index]?.input && <label className="label"><span className="label-text-alt text-error">{errors.examples[index].input.message}</span></label>}
                        </div>
                        <div className="form-control">
                          <label className="label"><span className="label-text font-medium">Output</span></label>
                          <textarea className="textarea textarea-bordered min-h-20 w-full p-3 resize-y" {...register(`examples.${index}.output`)} placeholder="Example output" />
                          {errors.examples?.[index]?.output && <label className="label"><span className="label-text-alt text-error">{errors.examples[index].output.message}</span></label>}
                        </div>
                      </div>
                      <div className="form-control mt-4">
                        <label className="label"><span className="label-text font-medium">Explanation (optional)</span></label>
                        <textarea className="textarea textarea-bordered min-h-24 w-full p-3 resize-y" {...register(`examples.${index}.explanation`)} placeholder="Explain the example" />
                        {errors.examples?.[index]?.explanation && <label className="label"><span className="label-text-alt text-error">{errors.examples[index].explanation.message}</span></label>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.examples && <div className="mt-2"><span className="text-error text-sm">{errors.examples.message}</span></div>}
            </div>

            {/* Code Editor Sections */}
            <div className="space-y-8">
              {['PYTHON', 'JAVA', 'C', 'CPP'].map((language) => (
                <div key={language} className="card bg-base-200 p-4 md:p-6 shadow-md">
                  <h3 className="text-lg md:text-xl font-semibold mb-6 flex items-center gap-2"><Code2 className="w-5 h-5" /> {language}</h3>
                  <div className="space-y-6">
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
                                onChange={(value) => field.onChange(value || '')}
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
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Information (editorial, constraints) */}
            <div className="card bg-base-200 p-4 md:p-6 shadow-md">
              <h3 className="text-lg md:text-xl font-semibold mb-6 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-warning" /> Additional Information</h3>
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Constraints</span></label>
                  <textarea className="textarea textarea-bordered min-h-24 w-full p-3 resize-y" {...register('constraints')} placeholder="Enter problem constraints" />
                  {errors.constraints && <label className="label"><span className="label-text-alt text-error">{errors.constraints.message}</span></label>}
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