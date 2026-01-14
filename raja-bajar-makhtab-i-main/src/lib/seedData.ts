import { Student, Teacher, Test, Payment, AttendanceRecord, Notice } from './types'

export const SEED_TEACHERS: Teacher[] = [
  {
    id: 't1',
    name: 'Qari Hafizur Rahman sb',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahman',
    subjects: ['Quran', 'Tajweed'],
    contact: '9876543210',
    email: 'rahman@rajabazar.edu',
    weeklyAvailability: [
      { day: 1, startTime: '09:00', endTime: '11:00' },
      { day: 3, startTime: '09:00', endTime: '11:00' },
      { day: 5, startTime: '09:00', endTime: '11:00' }
    ],
    isEnabled: true
  },
  {
    id: 't2',
    name: 'Hafiz Nawaid Sb',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zubair',
    subjects: ['Arabic Grammar', 'Fiqh'],
    contact: '9876543211',
    email: 'zubair@rajabazar.edu',
    weeklyAvailability: [
      { day: 2, startTime: '10:00', endTime: '12:00' },
      { day: 4, startTime: '10:00', endTime: '12:00' }
    ],
    isEnabled: true
  },
  {
    id: 't3',
    name: 'Hafiz Arman Sb',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=imran',
    subjects: ['Hadith', 'Islamic History'],
    contact: '9876543212',
    email: 'imran@rajabazar.edu',
    weeklyAvailability: [
      { day: 1, startTime: '14:00', endTime: '16:00' },
      { day: 3, startTime: '14:00', endTime: '16:00' },
      { day: 5, startTime: '14:00', endTime: '16:00' }
    ],
    isEnabled: true
  },
  {
    id: 't4',
    name: 'Hafiz Saif sb',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kaif',
    subjects: ['Quran Memorization', 'Tafseer'],
    contact: '9876543213',
    email: 'kaif@rajabazar.edu',
    weeklyAvailability: [
      { day: 0, startTime: '08:00', endTime: '10:00' },
      { day: 2, startTime: '08:00', endTime: '10:00' },
      { day: 4, startTime: '08:00', endTime: '10:00' }
    ],
    isEnabled: true
  },
  {
    id: 't5',
    name: 'Maulana Farhan Ali',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=farhan',
    subjects: ['Islamic Jurisprudence', 'Aqeedah'],
    contact: '9876543214',
    email: 'farhan@rajabazar.edu',
    weeklyAvailability: [
      { day: 1, startTime: '11:00', endTime: '13:00' },
      { day: 3, startTime: '11:00', endTime: '13:00' }
    ],
    isEnabled: true
  },
  {
    id: 't6',
    name: 'Ustadh Rizwan Shah',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rizwan',
    subjects: ['Arabic Literature', 'Urdu'],
    contact: '9876543215',
    email: 'rizwan@rajabazar.edu',
    weeklyAvailability: [
      { day: 2, startTime: '14:00', endTime: '16:00' },
      { day: 4, startTime: '14:00', endTime: '16:00' }
    ],
    isEnabled: true
  },
  {
    id: 't7',
    name: 'Maulana Sohail Ansari',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sohail',
    subjects: ['Fiqh', 'Hadith'],
    contact: '9876543216',
    email: 'sohail@rajabazar.edu',
    weeklyAvailability: [
      { day: 0, startTime: '10:00', endTime: '12:00' },
      { day: 5, startTime: '10:00', endTime: '12:00' }
    ],
    isEnabled: true
  },
  {
    id: 't8',
    name: 'Ustadh Nadeem Malik',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nadeem',
    subjects: ['Islamic Ethics', 'Seerah'],
    contact: '9876543217',
    email: 'nadeem@rajabazar.edu',
    weeklyAvailability: [
      { day: 1, startTime: '15:00', endTime: '17:00' },
      { day: 4, startTime: '15:00', endTime: '17:00' }
    ],
    isEnabled: true
  },
  {
    id: 't9',
    name: 'Maulana Yusuf Siddiqui',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yusuf',
    subjects: ['Quran', 'Tajweed', 'Arabic'],
    contact: '9876543218',
    email: 'yusuf@rajabazar.edu',
    weeklyAvailability: [
      { day: 2, startTime: '09:00', endTime: '11:00' },
      { day: 3, startTime: '09:00', endTime: '11:00' },
      { day: 5, startTime: '09:00', endTime: '11:00' }
    ],
    isEnabled: true
  },
  {
    id: 't10',
    name: 'Ustadh Asif Raza',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=asif',
    subjects: ['Mathematics', 'Science', 'English'],
    contact: '9876543219',
    email: 'asif@rajabazar.edu',
    weeklyAvailability: [
      { day: 0, startTime: '13:00', endTime: '15:00' },
      { day: 2, startTime: '13:00', endTime: '15:00' },
      { day: 4, startTime: '13:00', endTime: '15:00' }
    ],
    isEnabled: true
  }
]

export const SEED_STUDENTS: Student[] = [
  { id: 's11', name: 'Hafsa Begum', class: 'Fazil-1', guardianPhone: '9123456790', guardianName: 'Begum Sahiba', assignedTeachers: ['t5', 't6', 't8'], enrollmentDate: '2023-05-20' },
  { id: 's12', name: 'Khalid Ansari', class: 'Fazil-1', guardianPhone: '9123456791', guardianName: 'Ansari Sahab', assignedTeachers: ['t5', 't6', 't8'], enrollmentDate: '2023-05-20' },
  { id: 's13', name: 'Ruqayyah Khan', class: 'Fazil-1', guardianPhone: '9123456792', guardianName: 'Khan Sahab', assignedTeachers: ['t5', 't6', 't8'], enrollmentDate: '2023-05-20' },
  { id: 's14', name: 'Hamza Ali', class: 'Fazil-2', guardianPhone: '9123456793', guardianName: 'Ali Miyan', assignedTeachers: ['t5', 't7', 't8'], enrollmentDate: '2023-06-15' },
  { id: 's15', name: 'Zara Khatoon', class: 'Fazil-2', guardianPhone: '9123456794', guardianName: 'Khatoon Bibi', assignedTeachers: ['t5', 't7', 't8'], enrollmentDate: '2023-06-15' },
  { id: 's16', name: 'Omar Farooq', class: 'Nazra-1', guardianPhone: '9123456795', guardianName: 'Farooq Sahab', assignedTeachers: ['t1', 't10'], enrollmentDate: '2023-07-01' },
  { id: 's17', name: 'Amina Yasmin', class: 'Nazra-1', guardianPhone: '9123456796', guardianName: 'Yasmin Bibi', assignedTeachers: ['t1', 't10'], enrollmentDate: '2023-07-01' },
  { id: 's18', name: 'Yusuf Abdullah', class: 'Nazra-1', guardianPhone: '9123456797', guardianName: 'Abdullah Mia', assignedTeachers: ['t1', 't10'], enrollmentDate: '2023-07-01' },
  { id: 's19', name: 'Safiya Rahman', class: 'Nazra-2', guardianPhone: '9123456798', guardianName: 'Rahman Sahab', assignedTeachers: ['t1', 't9', 't10'], enrollmentDate: '2023-08-10' },
  { id: 's20', name: 'Tariq Alam', class: 'Nazra-2', guardianPhone: '9123456799', guardianName: 'Alam Bhai', assignedTeachers: ['t1', 't9', 't10'], enrollmentDate: '2023-08-10' },
  { id: 's21', name: 'Khadija Bibi', class: 'Nazra-2', guardianPhone: '9123456800', guardianName: 'Bibi Sahiba', assignedTeachers: ['t1', 't9', 't10'], enrollmentDate: '2023-08-10' },
  { id: 's22', name: 'Salman Shah', class: 'Hifz-1', guardianPhone: '9123456801', guardianName: 'Shah Sahab', assignedTeachers: ['t1', 't4'], enrollmentDate: '2023-09-05' },
  { id: 's23', name: 'Nadia Sultana', class: 'Hifz-2', guardianPhone: '9123456802', guardianName: 'Sultana Begum', assignedTeachers: ['t1', 't3'], enrollmentDate: '2023-09-05' },
  { id: 's24', name: 'Imran Siddique', class: 'Alim-1', guardianPhone: '9123456803', guardianName: 'Siddique Miyan', assignedTeachers: ['t2', 't5', 't9'], enrollmentDate: '2023-10-01' },
  { id: 's25', name: 'Sumaya Nasreen', class: 'Fazil-1', guardianPhone: '9123456804', guardianName: 'Nasreen Apa', assignedTeachers: ['t5', 't6', 't8'], enrollmentDate: '2023-10-01' }
]

export const SEED_TESTS: Test[] = [
  {
    id: 'test1',
    title: 'Quran Recitation Assessment',
    class: 'Hifz-1',
    subject: 'Quran',
    date: '2024-01-15',
    maxMarks: 100,
    teacherId: 't1',
    results: [
      { studentId: 's22', marksObtained: 82, percentage: 82, grade: 'A-', comments: 'Very good' }
    ]
  },
  {
    id: 'test2',
    title: 'Arabic Grammar - Mid Term',
    class: 'Alim-1',
    subject: 'Arabic Grammar',
    date: '2024-01-20',
    maxMarks: 100,
    teacherId: 't2',
    results: [
      { studentId: 's24', marksObtained: 80, percentage: 80, grade: 'A-', comments: 'Well done' }
    ]
  },
  {
    id: 'test3',
    title: 'Hadith Studies - Quiz',
    class: 'Alim-2',
    subject: 'Hadith',
    date: '2024-02-05',
    maxMarks: 50,
    teacherId: 't3',
    results: []
  },
  {
    id: 'test4',
    title: 'Fiqh - Practical Assessment',
    class: 'Fazil-1',
    subject: 'Fiqh',
    date: '2024-02-10',
    maxMarks: 100,
    teacherId: 't5',
    results: [
      { studentId: 's11', marksObtained: 88, percentage: 88, grade: 'A', comments: 'Clear understanding' },
      { studentId: 's12', marksObtained: 85, percentage: 85, grade: 'A', comments: 'Very good' },
      { studentId: 's13', marksObtained: 90, percentage: 90, grade: 'A+', comments: 'Exceptional' },
      { studentId: 's25', marksObtained: 82, percentage: 82, grade: 'A-', comments: 'Good work' }
    ]
  },
  {
    id: 'test5',
    title: 'Tajweed Rules - Oral Test',
    class: 'Hifz-2',
    subject: 'Tajweed',
    date: '2024-02-15',
    maxMarks: 100,
    teacherId: 't1',
    results: [
      { studentId: 's23', marksObtained: 89, percentage: 89, grade: 'A', comments: 'Excellent' }
    ]
  },
  {
    id: 'test6',
    title: 'Islamic History - Written Exam',
    class: 'Alim-2',
    subject: 'Islamic History',
    date: '2024-02-20',
    maxMarks: 100,
    teacherId: 't3',
    results: []
  }
]

const getDateString = (daysAgo: number): string => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split('T')[0]
}

export const SEED_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att1',
    teacherId: 't1',
    date: getDateString(5),
    status: 'held',
    students: [
      { studentId: 's22', status: 'absent' }
    ]
  },
  {
    id: 'att2',
    teacherId: 't1',
    date: getDateString(3),
    status: 'held',
    students: [
      { studentId: 's22', status: 'present' }
    ]
  },
  {
    id: 'att3',
    teacherId: 't2',
    date: getDateString(4),
    status: 'held',
    students: [
      { studentId: 's24', status: 'present' }
    ]
  },
  {
    id: 'att4',
    teacherId: 't2',
    date: getDateString(2),
    status: 'cancelled',
    students: []
  }
]

export const SEED_NOTICES: Notice[] = [
  {
    id: 'n1',
    title: 'Ramadan Schedule Update',
    content: 'During the holy month of Ramadan, classes will be held from 8:00 AM to 12:00 PM. Special Taraweeh arrangements will be made in the evening.',
    type: 'general',
    expiryDate: '2024-04-30',
    isPinned: true,
    createdAt: '2024-02-01T10:00:00Z',
    createdBy: 'admin'
  },
  {
    id: 'n2',
    title: 'Hifz-1 Class Test on Saturday',
    content: 'All Hifz-1 students must prepare Surah Al-Baqarah verses 1-50 for the upcoming test.',
    type: 'class-specific',
    targetClass: 'Hifz-1',
    expiryDate: '2024-03-15',
    isPinned: false,
    createdAt: '2024-02-05T14:30:00Z',
    createdBy: 'admin'
  },
  {
    id: 'n3',
    title: 'Fee Payment Reminder',
    content: 'Monthly fees for February must be submitted by 10th February. Please use the Payments section for online payment or contact the office.',
    type: 'general',
    expiryDate: '2024-02-10',
    isPinned: true,
    createdAt: '2024-02-01T09:00:00Z',
    createdBy: 'admin'
  },
  {
    id: 'n4',
    title: 'Parent-Teacher Meeting',
    content: 'A parent-teacher meeting is scheduled for all classes on 25th February at 3:00 PM. Attendance is mandatory.',
    type: 'general',
    expiryDate: '2024-02-25',
    isPinned: false,
    createdAt: '2024-02-10T11:00:00Z',
    createdBy: 'admin'
  }
]

export const SEED_PAYMENTS: Payment[] = [
  {
    id: 'p3',
    studentId: 's11',
    studentName: 'Hafsa Begum',
    class: 'Fazil-1',
    amount: 1600,
    date: '2024-02-03',
    method: 'UPI',
    status: 'pending'
  }
]

export function initializeLocalStorage() {
  if (!localStorage.getItem('teachers')) {
    localStorage.setItem('teachers', JSON.stringify(SEED_TEACHERS))
  }
  if (!localStorage.getItem('students')) {
    localStorage.setItem('students', JSON.stringify(SEED_STUDENTS))
  }
  if (!localStorage.getItem('tests')) {
    localStorage.setItem('tests', JSON.stringify(SEED_TESTS))
  }
  if (!localStorage.getItem('attendance')) {
    localStorage.setItem('attendance', JSON.stringify(SEED_ATTENDANCE))
  }
  if (!localStorage.getItem('notices')) {
    localStorage.setItem('notices', JSON.stringify(SEED_NOTICES))
  }
  if (!localStorage.getItem('payments')) {
    localStorage.setItem('payments', JSON.stringify(SEED_PAYMENTS))
  }
  if (!localStorage.getItem('otpDemoMode')) {
    localStorage.setItem('otpDemoMode', 'true')
  }
}
