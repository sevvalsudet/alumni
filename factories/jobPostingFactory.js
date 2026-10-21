// factories/jobPostingFactory.js
// Factory pattern for generating realistic JobPosting entities

const { faker } = require('@faker-js/faker');

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
const EXPERIENCE_LEVELS = ['Entry-level', 'Mid-level', 'Senior', 'Lead', 'Executive'];
const COMPANIES = ['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Spotify', 'Tesla', 'Netflix', 'Trendyol', 'Getir'];
const LOCATIONS = [
    'Istanbul, TR / Hybrid',
    'Istanbul, TR / On-site',
    'Ankara, TR / Hybrid',
    'Izmir, TR / On-site',
    'Remote',
    'Remote (EU & TR Timezones)',
    'London, UK / Hybrid',
    'Amsterdam, NL / On-site',
    'Berlin, DE / Hybrid',
    'San Francisco, CA / Remote'
];

const JOB_TEMPLATES = [
    {
        title: "Senior Backend Engineer - Cloud Platforms",
        employment_type: "Full-time",
        experience_level: "Senior",
        salary: 135000.00,
        description: "Lead the architecture and implementation of scalable, fault-tolerant microservices. Drive best practices in API performance, data streaming, and CI/CD automation.",
        requirements: "5+ years backend engineering experience with Node.js, Go, or Python. Deep understanding of Docker, Kubernetes, distributed databases, and high-concurrency systems."
    },
    {
        title: "Frontend Developer (React & TypeScript)",
        employment_type: "Full-time",
        experience_level: "Mid-level",
        salary: 95000.00,
        description: "Build delightful and accessible user interfaces for millions of users. Collaborate with product designers and backend teams to deliver high-performance web experiences.",
        requirements: "3+ years professional frontend development with React, TypeScript, modern CSS architectures, and state management tools."
    },
    {
        title: "Junior Software Engineer - Core Infrastructure",
        employment_type: "Full-time",
        experience_level: "Entry-level",
        salary: 75000.00,
        description: "Excellent career entry opportunity for fresh university graduates. You will write clean, well-tested code, participate in code reviews, and learn cloud-native paradigms.",
        requirements: "Degree in Computer Engineering or related discipline. Strong foundations in data structures, algorithms, SQL, and Git."
    },
    {
        title: "Machine Learning & AI Research Engineer",
        employment_type: "Full-time",
        experience_level: "Senior",
        salary: 150000.00,
        description: "Develop production-ready LLM pipelines, recommendation engines, and predictive neural network models serving mission-critical systems.",
        requirements: "Hands-on experience with PyTorch, TensorFlow, HuggingFace transformers, model fine-tuning, and scalable data pipeline engineering."
    },
    {
        title: "DevOps & Cloud Systems Architect",
        employment_type: "Remote",
        experience_level: "Lead",
        salary: 160000.00,
        description: "Design and maintain multi-cloud infrastructure, Terraform IaC modules, observability stacks, and security compliance protocols.",
        requirements: "Extensive background in AWS/GCP, Kubernetes clusters, Helm, Prometheus/Grafana, and robust disaster recovery strategies."
    },
    {
        title: "Mobile App Developer (iOS & Android)",
        employment_type: "Full-time",
        experience_level: "Mid-level",
        salary: 105000.00,
        description: "Create fluid, native-feeling mobile applications with Flutter or React Native. Optimize memory usage, offline-first caching, and animation performance.",
        requirements: "3+ years cross-platform or native mobile development. Published apps in Google Play Store or Apple App Store is a major plus."
    },
    {
        title: "Software Engineering Summer Intern",
        employment_type: "Internship",
        experience_level: "Entry-level",
        salary: 40000.00,
        description: "Paid summer internship program designed for 3rd and 4th year undergraduate students. Mentored by senior engineers on real-world production projects.",
        requirements: "Active student in Computer/Software Engineering. Passion for programming, eager to learn modern web frameworks."
    },
    {
        title: "Cybersecurity & Application Defense Specialist",
        employment_type: "Full-time",
        experience_level: "Senior",
        salary: 140000.00,
        description: "Protect applications against OWASP Top 10 vulnerabilities, conduct penetration testing, and configure zero-trust access policies.",
        requirements: "Certifications such as OSCP or CISSP preferred. Strong understanding of cryptography, network protocols, and secure SDLC."
    },
    {
        title: "Data Platform & Analytics Engineer",
        employment_type: "Full-time",
        experience_level: "Mid-level",
        salary: 110000.00,
        description: "Build robust ETL/ELT data pipelines, maintain data warehouses in Snowflake/BigQuery, and empower business intelligence teams.",
        requirements: "Proficiency in SQL, Python, dbt, Apache Airflow, and lakehouse storage formats."
    },
    {
        title: "Product Manager - Developer Platform",
        employment_type: "Full-time",
        experience_level: "Lead",
        salary: 145000.00,
        description: "Define the product roadmap for developer-facing APIs and internal developer tooling. Conduct user interviews and align cross-functional engineering teams.",
        requirements: "Technical background in software engineering, demonstrated experience managing technical SaaS or API products."
    }
];

// Valid user IDs who can post jobs (Alumni and Admin accounts from seed)
const VALID_POSTER_IDS = [2, 3, 4, 5, 7, 9, 11, 12, 13, 17, 18, 19, 20, 21, 22, 24];

let currentId = 1;

const jobPostingFactory = {
    // Generate single job posting entity definition
    definition: (overrides = {}) => {
        const template = faker.helpers.arrayElement(JOB_TEMPLATES);
        const company = overrides.company || faker.helpers.arrayElement(COMPANIES);
        const postedBy = overrides.posted_by !== undefined ? overrides.posted_by : faker.helpers.arrayElement(VALID_POSTER_IDS);
        const employmentType = overrides.employment_type || template.employment_type;
        const experienceLevel = overrides.experience_level || template.experience_level;
        const location = overrides.location || faker.helpers.arrayElement(LOCATIONS);

        const deadlineDate = new Date();
        deadlineDate.setMonth(deadlineDate.getMonth() + faker.number.int({ min: 1, max: 6 }));
        const deadlineStr = deadlineDate.toISOString().split('T')[0];

        return {
            id: overrides.id !== undefined ? overrides.id : currentId++,
            posted_by: postedBy,
            title: overrides.title || template.title,
            company,
            location,
            employment_type: employmentType,
            experience_level: experienceLevel,
            salary: overrides.salary !== undefined ? overrides.salary : template.salary,
            description: overrides.description || template.description,
            requirements: overrides.requirements || template.requirements,
            contact_email: overrides.contact_email || `careers@${company.toLowerCase().replace(/\s+/g, '')}.com`,
            application_url: overrides.application_url || `https://${company.toLowerCase().replace(/\s+/g, '')}.com/careers`,
            application_deadline: overrides.application_deadline || deadlineStr,
            is_active: overrides.is_active !== undefined ? overrides.is_active : true,
            created_at: overrides.created_at || faker.date.recent({ days: 15 }).toISOString(),
            updated_at: overrides.updated_at || new Date().toISOString(),
            ...overrides
        };
    },

    // Create a single instance
    create: (overrides = {}) => {
        return jobPostingFactory.definition(overrides);
    },

    // Create multiple instances
    createMany: (count = 5, overrides = {}) => {
        return Array.from({ length: count }, () => jobPostingFactory.definition(overrides));
    },

    // Reset auto-increment counter
    resetId: (start = 1) => {
        currentId = start;
    }
};

module.exports = jobPostingFactory;
