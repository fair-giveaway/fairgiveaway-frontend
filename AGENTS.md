<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# RUlES

**STRICT COMMENT LIMITS**:
   - **Density**: Comments must not exceed 20% of the file's total lines (30% for files under 50 lines).
   - **Vertical**: Max 10 consecutive comment lines for function docstrings. Max 3 consecutive comment lines for inline logic.
   - **Horizontal**: No comment line can exceed 80 characters.
   - **Quality**: Explain "Why", not "What". Never state the obvious. Never leave commented-out code.
**KEEP IT CONCISE**:
   - Files must not exceed 300 lines.
   - Functions must not exceed 50 lines.
   Do not generate massive monolithic blocks of code. Break down your logic into smaller, modular helpers.
   
<!-- END:nextjs-agent-rules -->
