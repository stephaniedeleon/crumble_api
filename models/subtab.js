const db = require("../db");
const { BadRequestError } = require("../utils/errors");

class Subtab {

    /** Fetch subtab by id */
    static async fetchSubtabById(sub_id, user) {

        const query = `
            SELECT * FROM subtabs
            WHERE subtabs.id = $1 AND subtabs.user_id = (SELECT id FROM users WHERE email=$2);
        `
        const result = await db.query(query, [sub_id, user.email]);

        //return subtab
        return result.rows[0];
    }


    /** Fetch all subtabs by maintab id */
    static async listSubtabsByMain(main_id, user) {

        const query = `
            SELECT * FROM subtabs
            WHERE subtabs.main_id = $1 AND subtabs.user_id = (SELECT id FROM users WHERE email=$2)
            ORDER BY created_at DESC;
        `;

        const result = await db.query(query, [main_id, user.email]);

        // return subtabs
        return result.rows;
    }

    /* Fetch all subtabs by subtab id */
    static async listSubtabsBySubtab(sub_id, user) {

        const query = `
            SELECT * FROM subtabs
            WHERE subtabs.sub_id = $1 AND subtabs.user_id = (SELECT id FROM users WHERE email=$2)
            ORDER BY created_at DESC;
        `;

        const result = await db.query(query, [sub_id, user.email]);

        // return subtabs
        return result.rows;
    }

    /** Creating a subtab from maintab */
    static async createSubtabFromMain({ user, main_id, subtab }) {

        const requiredFields = ["name"];
        requiredFields.forEach((field) => {
            if (!subtab.hasOwnProperty(field) || !subtab[field]) {
                throw new BadRequestError(
                    `Required field - ${field} - missing from request body.`
                );
            }
        });

        const query = `
            INSERT INTO subtabs (user_id, main_id, name)
            VALUES ((SELECT id FROM users WHERE email=$1), $2, $3)
            RETURNING id, user_id, main_id, name, completed, created_at;
        `;

        const result = await db.query(query, [user.email, main_id, subtab.name]);

        // return new subtab
        return result.rows[0];
    }

    /** Creating a subtab from subtab */
    static async createSubtabFromSub({ user, sub_id, subtab }) {

        const requiredFields = ["name"];
        requiredFields.forEach((field) => {
            if (!subtab.hasOwnProperty(field) || !subtab[field]) {
                throw new BadRequestError(
                    `Required field - ${field} - missing from request body.`
                );
            }
        });

        const query = `
            INSERT INTO subtabs (user_id, sub_id, name)
            VALUES ((SELECT id FROM users WHERE email=$1), $2, $3)
            RETURNING id, user_id, sub_id, name, completed, created_at;
        `;

        const result = await db.query(query, [user.email, sub_id, subtab.name]);

        // return new subtab
        return result.rows[0];
    }

    /** Deleting a subtab  */
    static async deleteSubtab(subtabId, user) {

        const query = `
            DELETE FROM subtabs
            WHERE subtabs.id = $1 AND subtabs.user_id = (SELECT id FROM users WHERE email=$2);
        `;

        const result = await db.query(query, [subtabId, user.email]);

        return result.rows[0];
    }

    /** Updating a subtab name */
    static async updateSubtab({subtabId, updatedSubtab, user}) {

        const query = `
            UPDATE subtabs
            SET name = $1, updated_at = NOW()
            WHERE subtabs.id = $2 AND subtabs.user_id = (SELECT id FROM users WHERE email=$3)
            RETURNING id, user_id, main_id, sub_id, name, created_at, updated_at; 
        `
        const result = await db.query(query, [updatedSubtab.name, subtabId, user.email]);

        return result.rows[0];
    }


    /** Mark subtab */
    static async markSubtab(subtabId, user) {

        const query = `
            UPDATE subtabs
            SET completed = TRUE, completed_at = NOW()
            WHERE subtabs.id = $1 AND subtabs.user_id = (SELECT id FROM users WHERE email=$2);
        `

        const result = await db.query(query, [subtabId, user.email]);

        // return subtab
        return result.rows[0];
    }

    /** Unmark subtab */
    static async unmarkSubtab(maintabId, user) {
        const query = `
            UPDATE subtabs
            SET completed = FALSE
            WHERE subtabs.id = $1 AND subtabs.user_id = (SELECT id FROM users WHERE email=$2);
        `

        const result = await db.query(query, [maintabId, user.email]);

        // return subtab
        return result.rows[0];
    }

    // /** Deleting completed subtabs  */
    // static async deleteCompletedSubtabs() {
    //     const query = `
    //             DELETE FROM subtabs
    //             WHERE completed = TRUE;
    //         `;

    //     const result = await db.query(query);

    //     return result.rows[0];
    // }

    /** Return object containing directory tree data */
    static async getDirectoryData(maintabId, user) {
      
      const query = `
              SELECT * FROM main_tabs
              WHERE main_tabs.id = $1 AND main_tabs.user_id = (SELECT id FROM users WHERE email=$2);
          `;
      const result = await db.query(query, [maintabId, user.email]);
      const maintab = result.rows[0];
      const primarySubtabs = await this.listSubtabsByMain(maintabId, user);

      const children = await Promise.all(
        primarySubtabs.map(async (element) =>
          this.createTreeNode({
            tabObject: element,
            children: await this.getChildren(element.id, user),
          })
        )
      );

      let data = this.createTreeNode({
        tabObject: maintab,
        id: "root",
        children: children,
      });
      return data;
    }

    // Recursivaly returns an array of all children subtabs associated to the subtabId
    static async getChildren(subtabId, user) {
      const subtabs = await this.listSubtabsBySubtab(subtabId, user);
      if (!subtabs.length) {
        return [];
      }

      const children = await Promise.all(
        subtabs.map(async (element) =>
          this.createTreeNode({
            tabObject: element,
            children: await this.getChildren(element.id, user),
          })
        )
      );

      return children;
    }

    /** args: { tabObject, id (optional), children (optional) } */
    static createTreeNode(args) {
      try {
        if ("id" in args) {
          if ("children" in args && args.children !== []) {
            return new TreeNode(args.tabObject, args.id, args.children);
          }

          return new TreeNode(args.tabObject, args.id, []);
          
        } else if ("children" in args) {
          return new TreeNode(args.tabObject, args.tabObject.id, args.children);
        }
        return new TreeNode(args.tabObject, args.tabObject.id, []);
      } catch (err) {
        console.log(err);
      }
    }
}

class TreeNode {
    constructor(tabObject, id, childrenArray) {
        this.id = id;
        this.name = tabObject.name;
        this.children = childrenArray;
    }
}

module.exports = Subtab;
