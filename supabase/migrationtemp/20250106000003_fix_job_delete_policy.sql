-- Fix job deletion policy to allow employers to delete their own jobs
-- regardless of status (unless they have applications)

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Employers can delete own draft jobs" ON jobs;

-- Create new policy that allows deletion if no applications exist
CREATE POLICY "Employers can delete own jobs without applications"
ON jobs FOR DELETE
USING (
    employer_id = get_user_employer_id()
    AND applications_count = 0
);

-- Keep admin policy as is (already exists)
