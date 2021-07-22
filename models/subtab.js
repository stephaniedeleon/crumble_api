const db = require("../db");
const { BadRequestError } = require("../utils/errors");

class Subtab {
  /** Fetch all subtabs by maintab id */
  static async listSubtabsByMain(main_id) {
    const query = `
            SELECT * FROM subtabs
            WHERE subtabs.main_id = $1
            ORDER BY created_at DESC;
        `;

    const result = await db.query(query, [main_id]);

    // return subtabs
    return result.rows;
  }

  /* Fetch all subtabs by subtab id */
  static async listSubtabsBySubtab(sub_id) {
    const query = `
            SELECT * FROM subtabs
            WHERE subtabs.sub_id = $1
            ORDER BY created_at DESC;
        `;

    const result = await db.query(query, [sub_id]);

    // return subtabs
    return result.rows;
  }

  /** Creating a subtab from maintab */
  static async createSubtabFromMain({ main_id, subtab }) {
    const requiredFields = ["name"];
    requiredFields.forEach((field) => {
      if (!subtab.hasOwnProperty(field) || !subtab[field]) {
        throw new BadRequestError(
          `Required field - ${field} - missing from request body.`
        );
      }
    });

    const query = `
            INSERT INTO subtabs (main_id, name)
            VALUES ($1, $2)
            RETURNING id, main_id, name, completed, created_at;
        `;

    const result = await db.query(query, [main_id, subtab.name]);

    // return new subtab
    return result.rows[0];
  }

  /** Creating a subtab from subtab */
  static async createSubtabFromSub({ sub_id, subtab }) {
    const requiredFields = ["name"];
    requiredFields.forEach((field) => {
      if (!subtab.hasOwnProperty(field) || !subtab[field]) {
        throw new BadRequestError(
          `Required field - ${field} - missing from request body.`
        );
      }
    });

    const query = `
            INSERT INTO subtabs (sub_id, name)
            VALUES ($1, $2)
            RETURNING id, sub_id, name, completed, created_at;
        `;

    const result = await db.query(query, [sub_id, subtab.name]);

    // return new subtab
    return result.rows[0];
  }

  /** Deleting a subtab  */
  static async deleteSubtab(id) {
    const query = `
            DELETE FROM subtabs
            WHERE subtabs.id = $1;
        `;

    const result = await db.query(query, [id]);

    return result.rows;
  }

/** Mark subtab */
static async markSubtab(id) {
    const query = `
        UPDATE subtabs
        SET completed = TRUE
        WHERE id = $1
    `

    const result = await db.query(query, [id]);

    // return subtab
    return result.rows[0];
}

/** Unmark subtab */
static async unmarkSubtab(id) {
    const query = `
        UPDATE subtabs
        SET completed = FALSE
        WHERE id = $1
    `

    const result = await db.query(query, [id]);

    // return subtab
    return result.rows[0];
}

  /** Return object containing directory tree data */
  static async getDirectoryData(maintabId, user) {
    const query = `
            SELECT * FROM main_tabs
            WHERE main_tabs.id = $1 AND main_tabs.user_id = (SELECT id FROM users WHERE email=$2);
        `;
    const result = await db.query(query, [maintabId, user.email]);
    const maintab = result.rows[0];
    const primarySubtabs = await this.listSubtabsByMain(maintabId);

    const children = await Promise.all(
      primarySubtabs.map(async (element) =>
        this.createTreeNode({
          tabObject: element,
          children: await this.getChildren(element.id),
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
  static async getChildren(subtabId) {
    const subtabs = await this.listSubtabsBySubtab(subtabId);
    if (!subtabs.length) {
      return;
    }

    const children = await Promise.all(
      subtabs.map(async (element) =>
        this.createTreeNode({
          tabObject: element,
          children: await this.getChildren(element.id),
        })
      )
    );

    return children;
  }

  /** args: { tabObject, id (optional), children (optional) } */
  static createTreeNode(args) {
    try {
      if ("id" in args) {
        if ("children" in args && args.children !== undefined) {
          return new TreeNode(args.tabObject, args.id, args.children);
        }

        return new TreeNode(args.tabObject, args.id, undefined);
      } else if ("children" in args) {
        return new TreeNode(args.tabObject, args.tabObject.id, args.children);
      }
      return new TreeNode(args.tabObject, args.tabObject.id, undefined);
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
